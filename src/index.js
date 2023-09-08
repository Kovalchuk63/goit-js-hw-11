import Notiflix from "notiflix";
import { PicAPI } from "./PBPic";
import SimpleLightBox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});

const picAPI = new PicAPI();

const refs = {
  blockform: document.querySelector('#search-form'),
  btnload: document.querySelector('.load-more'),
  picset: document.querySelector('.gallery')
};

refs.blockform.addEventListener('submit', onSubmit);
refs.btnload.addEventListener('click', onBtn);
window.addEventListener('scroll', onScroll);

async function onBtn(evt) {
  try {
    const data = await picApi.getPic();
    renderPic(data.hits);
    if (picApi.PAGE >= picApi.TOTAL_PAGES) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMoreBtn.disabled = true;
    }
  } catch (error) {
    console.error(error);
  }
}



async function onScroll() {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

   /* прокрутив сторінку до певного порогу  80% */
  if (scrollPosition + windowHeight >= documentHeight * 0.8) {
    try {
      const data = await picAPI.getPic();
      renderPic(data.hits);

      if (picAPI.PAGE >= picAPI.TOTAL_PAGES) {
        showEndOfResultsMessage();
        window.removeEventListener('scroll', onScroll); 
      }
    } catch (error) {
      handleAPIError(error);
    }
  }
}

async function onSubmit(evt) {
  evt.preventDefault();
  const query = evt.target.searchQuery.value.trim();

  if (query === '') {
    Notiflix.Notify.failure('Please, enter a search query.');
    return;
  }

  refs.picset.innerHTML = '';
  picAPI.resetPage();
  picAPI.QUERY = query;

  try { 
    const data = await picAPI.getPic();

    if (data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      enableLoadMoreButton();
      renderPic(data.hits);
      showTotalHits(data.totalHits);
    }
  } catch (error) {
    handleAPIError(error);
  }
}




function renderPic(hits) {
  const markup = hits.map(element => {
    return `<a class="photo-card" href="${element.largeImageURL}">
              <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
              <div class="info">
                  <p class="info-item"><b>Likes: ${element.likes}</b></p>
                  <p class="info-item"><b>Views: ${element.views}</b></p>
                  <p class="info-item"><b>Comments: ${element.comments}</b></p>
                  <p class="info-item"><b>Downloads: ${element.downloads}</b></p>
              </div>
            </a>`;
  }).join('');

  refs.picset.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function showTotalHits(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function showErrorMessage(message) {
  Notiflix.Notify.failure(message);
}

function showEndOfResultsMessage() {
  Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
  disableLoadMoreButton();
}

function handleAPIError(error) {
  console.error(error);
  showErrorMessage('An error occurred while fetching data. Please try again later.');
}

function enableLoadMoreButton() {
  refs.btnload.disabled = false;
}

function disableLoadMoreButton() {
  refs.btnload.disabled = true;
}



