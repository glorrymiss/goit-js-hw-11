import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const refs = {
  form: document.querySelector('#search-form'),
  container: document.querySelector('.gallery'),
  btnLoad: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearch);
refs.btnLoad.addEventListener('click', loadMore);

let inputValue = '';
let page = 1;
let per_page = 100;
const URL = 'https://pixabay.com/api/';
const KEY = '33635231-9592dead0045fe81be9248485';
const options = {
  q: inputValue /*виправити на inputValue */,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
};
const optionJSON = JSON.stringify(options);
function fetchArticles(page = 1) {
  return fetch(
    `${URL}?key=${KEY}&${optionJSON}&page=${page}&per_page=${per_page}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

function onSearch(event) {
  event.preventDefault();

  inputValue = event.currentTarget.elements.searchQuery.value.trim();
  console.log(inputValue);
  onUpdate();
  fetchArticles()
    .then(data => {
      if (data.hits === [] || data.hits.length === 0) {
        Notiflix.Notify.error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      } else {
        page = 1;
        createMarkup(data.hits);

        // page = 1;

        refs.btnLoad.hidden = false;
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      }
    })

    .catch(error => console.log(error));
}

function loadMore() {
  page += 1;

  fetchArticles(page).then(data => {
    createMarkup(data.hits);
    const pages = Math.ceil(data.totalHits / per_page);

    if (pages === page) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      refs.btnLoad.hidden = true;
    }
  });

  //   const result = data.total - data.totalHits;
  //   Notiflix.Notify.info(
  //     "We're sorry, but you've reached the end of search results."
  //   );
}

function createMarkup(arr) {
  const markup = arr
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `
      <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="320" heigth ="280"/>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${likes}
    </p>
    <p class="info-item">
      <b>Wiews:</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${downloads}
    </p>
  </div>
</div>
    `;
    })
    .join('');
  refs.container.insertAdjacentHTML('beforeend', markup);
}

// function addMarkup(markup) {
//   refs.container.insertAdjacentHTML('beforeend', markup);
// }
function onUpdate() {
  refs.form.reset();
  refs.container.innerHTML = '';
}
