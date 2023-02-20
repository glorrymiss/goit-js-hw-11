import fetchArticles from './fetchAPI';

import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios/dist/browser/axios.cjs');

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  container: document.querySelector('.gallery'),
  btnLoad: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearch);
refs.btnLoad.addEventListener('click', loadMore);

let page = 1;
let per_page = 200;
let gallery = new SimpleLightbox('.gallery a');

async function onSearch(event) {
  event.preventDefault();

  inputValue = event.currentTarget.elements.searchQuery.value.trim();
  console.log(inputValue);
  if (inputValue === '') {
    onUpdate();
    return;
  }
  onUpdate();
  try {
    const response = await fetchArticles();

    if (response.hits === [] || response.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return '';
    } else {
      page = 1;
      createMarkup(response.hits);
      refs.btnLoad.hidden = false;
      Notiflix.Notify.info(`Hooray! We found ${response.totalHits} images.`);
      gallery.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }
    // });
  } catch (error) {
    console.log(error);
  }
}

async function loadMore() {
  page += 1;

  const response = await fetchArticles(page);
  // .then(data => {
  createMarkup(response.hits);
  gallery.refresh();

  const pages = Math.ceil(response.totalHits / per_page);

  if (page === pages) {
    refs.btnLoad.hidden = true;
    refs.btnLoad.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  // });
}

function createMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <a class='card-link' href="${largeImageURL}">
      <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="320" height ="280"/>
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
</a>
    `;
      }
    )
    .join('');

  refs.container.insertAdjacentHTML('beforeend', markup);
  //  add lightbox
  gallery = new SimpleLightbox('.gallery a');
}

function onUpdate() {
  refs.container.innerHTML = '';
}

export {};
