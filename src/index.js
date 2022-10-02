import './css/styles.css';
import fetchCountries from "./fetchCountries";
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const countrySearch = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryDescription = document.querySelector('.country-info');

countrySearch.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt){
    const countrySearchInput = evt.target.value.trim();
    if (countrySearchInput === '') {
        countryList.innerHTML = '';
        countryDescription.innerHTML = '';
        return;
    }
    else {
        return fetchCountries(countrySearchInput)
            .then(countries => renderCountries(countries))
            .catch(error => {
                console.log(error);
           Notiflix.Notify.failure('Oops, there is no country with that name');
        })
    }
}

function renderCountries(countries) {
    // > 10 
    if (countries.length > 10) {
        countryList.innerHTML = '';
        countryDescription.innerHTML = '';
        return Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
    }
    // 2 - 10
    if (countries.length > 1  && countries.length < 10) {
        const markup = countries.map(({ name, flags }) => `<li style="font-size: 20px; display: flex; align-items: center; "><img style = "padding-right: 5px" src="${flags.svg}" width="40" /> ${name}</li>`).join('');
        countryList.innerHTML = markup;
        countryDescription.innerHTML = '';
    }
    // 1 
    if (countries.length === 1) {
        const descriptionMarkup = countries.map(({ name, flags }) => {
            return `<li style="font-size: 30px; font-weight: 700; display: flex-end; align-items: center; margin-bottom: 10px">
        <img style = "padding-right: 5px" src="${flags.svg}" width="40" /> ${name}</li>
        `;
        }).join('');
        const detailedDescriptionMarkup = countries.map(({ capital, population, languages }) => {
            return `<p style="font-size: 20px; font-weight: 700 "> Capital: <span style="font-weight: 400 ">${capital}</span></p>
        <p style="font-size: 20px; font-weight: 700 "> Population: <span style="font-weight: 400 ">${population}</span></p>
        <p style="font-size: 20px; font-weight: 700 "> Languages: <span style="font-weight: 400 ">${languages[0].name}</span></p>`;
        }).join('');
        countryList.innerHTML = descriptionMarkup;
        countryDescription.innerHTML = detailedDescriptionMarkup;
}
}