const axios = require('axios/dist/browser/axios.cjs');

const URL = 'https://pixabay.com/api/';
const KEY = '33635231-9592dead0045fe81be9248485';
let inputValue = '';
let per_page = 200;

export default async function fetchArticles(page = 1) {
  return await axios
    .get(
      `${URL}?key=${KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`
    )
    .then(response => response.data);
  // if (!response.ok) {
  //   throw new Error(response.statusText);
  // }
}
