import { fetchMovieData } from '../../data/fetchMovie.js';

async function renderCountryList() {
  const countryList = await fetchMovieData('configuration/countries');
  const list = ['United States of America', 'united kingdom', 'canada', 'brazil', 'new zealand', 'france', 'spain', 'australia', 'ireland', 'italy', 'japan', 'switzerland', 'denmark', 'belgium'];
  const filteredList = list.map(country => {
    return countryList.find(c => country.toLowerCase() === c.english_name.toLowerCase());
  });

  const countryBtn = filteredList.map(country => {
    return `
      <button class="px-5 py-2 bg-gray-700 rounded-full duration-300 hover:bg-gray-600" data-country-code="${country.
        iso_3166_1}">${country.native_name}</button>
    `;
  }).join('')

  document.querySelector('.country-btns').innerHTML = countryBtn;

  const countryBtnsEl = document.querySelectorAll('.country-btns button');
  countryBtnsEl.forEach(btn => {
    btn.addEventListener('click', () => {
      const { countryCode } = btn.dataset;

      window.location.href = `./show-by-country.html?country=${countryCode}`;
    })
  })
};



renderCountryList();