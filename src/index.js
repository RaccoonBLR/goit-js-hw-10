import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const infoNotice = 'Too many matches found. Please enter a more specific name';
const failureNotice = 'Oops, there is no country with that name';

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  const searchValue = evt.target.value.trim();

  if (!searchValue) {
    resetDynamicPageEl(refs.countryInfo);
    resetDynamicPageEl(refs.countryList);
    return;
  }

  fetchCountries(searchValue)
    .then(response => {
      if (response.length > 10) {
        Notiflix.Notify.info(infoNotice);

        resetDynamicPageEl(refs.countryList);
        resetDynamicPageEl(refs.countryInfo);

        return;
      }

      if (response.length >= 2 && response.length <= 10) {
        resetDynamicPageEl(refs.countryInfo);
        dynamicInterfaceInit(
          refs.countryList,
          createCountryListMarkup(response)
        );

        return;
      }

      if (response.length === 1) {
        resetDynamicPageEl(refs.countryList);
        dynamicInterfaceInit(
          refs.countryInfo,
          createCountryInfoMarkup(response)
        );

        return;
      }
    })
    .catch(() => {
      Notiflix.Notify.failure(failureNotice);
      resetDynamicPageEl(refs.countryInfo);
      resetDynamicPageEl(refs.countryList);
    });
}

function resetDynamicPageEl(ref) {
  if (ref.children.length) {
    ref.innerHTML = '';
  }
  return;
}

function dynamicInterfaceInit(ref, markup) {
  ref.innerHTML = markup;
}

function createCountryInfoMarkup(countries) {
  return countries
    .map(country => {
      return `<div class="title-wrapper"><img 
    src="${country.flags.svg}" alt="${country.name.common}" 
    width="70" height="35" />
                            <h1>${country.name.common}</h1></div>
                            <p><b>Capital:&nbsp</b>${country.capital}</p>
                            <p><b>Population:&nbsp</b>${country.population}</p>
                            <p><b>Languages:&nbsp</b>${Object.values(
                              country.languages
                            )}</p>`;
    })
    .join('');
}

function createCountryListMarkup(countries) {
  return countries
    .map(country => {
      return `<li><img src="${country.flags.svg}" alt="${country.name.common} flag" width="30" height="20"></img> <p>${country.name.official}</p>
              </li>`;
    })
    .join('');
}
