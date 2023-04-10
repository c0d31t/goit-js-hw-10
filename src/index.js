import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');

input.addEventListener('input', debounce(onInputClick, DEBOUNCE_DELAY));

function onInputClick(event) {
  const value = event.target.value.trim();

  if (value === '') {
    list.innerHTML = '';
    return;
  }

  fetchCountries(value).then(data => {
    if (!data) {
      return;
    }
    if (data.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
      return;
    }

    if (data.length > 1 && data.length < 10) {
      createCard(data);
      return;
    }
    renderCard(data);
  });
}

function createCard(data) {
  const markup = data
    .map(({ name, flags }) => {
      return `<li class="list-item">
      <img class="list-img" src="${flags.svg}" alt="" />
     <span class="list-name">${name.official}</span>
      </li>`;
    })
    .join('');
  list.innerHTML = markup;
}

function renderCard(data) {
  const { name, capital, population, flags, languages } = data[0];
  const language = Object.values(languages).join(',');
  const markup = `<li><img class="list-img" src="${flags.svg}" alt=""/>
  <span class="list-text"><b>${name.common}</b></span>
        <p class="title"><b>Capital: </b>${capital}</p>
        <p class="title"><b>Population: </b>${population}</p>
        <p class="title"><b>Languages: </b>${language}</p>
       </li>`;

  list.innerHTML = markup;
}
