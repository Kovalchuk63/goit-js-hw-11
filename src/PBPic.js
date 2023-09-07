import axios from "axios"

export class PicAPI {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '39292366-58b8f7fa8b94aa94d5ed6851d';
    #IMAGE_TYPE = 'photo';
    #ORIENTATION = 'horizontal';
    #SAFESEARCH = 'true';
    #PER_PAGE = 40;
    PAGE = 1;
    QUERY = '';
    TOTAL_PAGES = 1;

    async getPic(query) {
    const url = this.#BASE_URL
    const params = new URLSearchParams({
    q: this.QUERY,
    key: this.#API_KEY,
    image_type: this.#IMAGE_TYPE,
    orientation: this.#ORIENTATION,
    safesearch: this.#SAFESEARCH,
    page: this.PAGE
    });

    const response = await axios.get(`${url}?${params}`);
    const data = response.data;

    this.TOTAL_PAGES = Math.ceil(data.totalHits / this.#PER_PAGE);
    this.nextPage();
    return data;
   }

   get RerPage() {
    return this.#PER_PAGE
   }

   nextPage() {
    this.PAGE++;
   }

   resetPage() {
    this.PAGE = 1}

}
