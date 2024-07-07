import { fetchMovieData } from '../../data/fetchMovie.js';

async function renderGenres() {
  
  await movieGenres();
  tvGenres();
}

async function movieGenres() {
  const genreData = await fetchMovieData('genre/movie/list');
  const genres = genreData.genres;
  console.log(genres[0]);

  const genreBtns = genres.map(genre => {
    return `
      <button class="px-5 py-2 bg-gray-700 rounded-full duration-300 hover:bg-gray-600">${genre.name}</button>
    `;
  }).join('');

  document.querySelector('.movie-genres .genre-btns').innerHTML = genreBtns;
}

async function tvGenres() {
  const genreData = await fetchMovieData('genre/tv/list');
  const genres = genreData.genres;
  
  const genreBtns = genres.map(genre => {``
    return `
      <button class="px-5 py-2 bg-gray-700 rounded-full duration-300 hover:bg-gray-600">${genre.name}</button>
    `;
  }).join('');

  document.querySelector('.tv-genres .genre-btns').innerHTML = genreBtns;
}

window.addEventListener('load', () => {
  renderGenres();
});