import { fetchMovieData } from '../../data/fetchMovie.js';

async function renderGenres() {
  
  await movieGenres();
  await tvGenres();
  
  const genreBtns = document.querySelectorAll('.genre-btns button');
  genreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const { genreId, genreName, showType } = btn.dataset;
      window.location.href = `./show-by-genre.html?show-type=${showType}&genre-id=${genreId}&genre-name=${genreName}&page=1`;
    });
  })
}

async function movieGenres() {
  const genreData = await fetchMovieData('genre/movie/list');
  const genres = genreData.genres;
  const genreBtns = genres.map(genre => {
    return `
      <button class="px-5 py-2 bg-gray-700 rounded-full duration-300 hover:bg-gray-600" data-show-type="movie" data-genre-id="${genre.id}" data-genre-name="${genre.name}">${genre.name}</button>
    `;
  }).join('');

  document.querySelector('.movie-genres .genre-btns').innerHTML = genreBtns;
}

async function tvGenres() {
  const genreData = await fetchMovieData('genre/tv/list');
  const genres = genreData.genres;
  const genreBtns = genres.map(genre => {``
    return `
      <button class="px-5 py-2 bg-gray-700 rounded-full duration-300 hover:bg-gray-600" data-show-type="tv" data-genre-id="${genre.id}" data-genre-name="${genre.name}">${genre.name}</button>
    `;
  }).join('');

  document.querySelector('.tv-genres .genre-btns').innerHTML = genreBtns;
}

window.addEventListener('load', () => {
  renderGenres();
});