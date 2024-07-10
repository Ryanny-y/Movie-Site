import { fetchMovieData } from '../../../data/fetchMovie.js';
import { fetchVideo } from '../../../data/fetchVideo.js';
import { formatRunTime, formatDate, formatVote } from '../../utils/formatDate.js';
import { showMovieDetail } from '../../utils/movieDetail.js';
import { searchBar } from '../../utils/searchBar.js';
import { renderRecommendation, renderReviews } from '../../utils/recomReview.js';

async function renderWatchMovie() {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const id = params.get('id');
  
  searchBar();
  // loadVideo(id)
  await displayMovieDetails(id);
  await renderRecommendation(id);
  showMovieDetail();
  renderReviews(id);
}

async function loadVideo(id) {
  const vid = await fetchVideo(`movie/${id}`);
  const videoContainer = document.querySelector('.video-container iframe');
  videoContainer.src = vid.url;
}

async function displayMovieDetails(id) {
  const details = await fetchMovieData(`movie/${id}`);
  const { poster_path: img, 
          title, 
          genres,
          release_date, 
          runtime, 
          vote_average, 
          overview,  
          production_countries: [{ name: country }],
          production_companies } = details;

  const genreHTML1 = genres.slice(0,3).map(genre => {
    return `
      <p class="bg-white p-2 rounded-md ">${genre.name}</p>
    `
  }).join('');
  const genreHTML = genres.slice(0, 3).map(genre => genre.name).join(', ');

  document.querySelector('.movie-poster img').src = `https://image.tmdb.org/t/p/w500${img}`
  document.querySelector('.details .title').textContent = title;
  document.querySelector('.genres').innerHTML = genreHTML1;
  document.querySelector('.release_year').innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${release_date.split('').slice(0,4).join('')}`;
  document.querySelector('.runtime').innerHTML = `<i class="far fa-clock"></i> ${formatRunTime(runtime)}`;
  document.querySelector('.average').innerHTML = `<i class="fa-solid fa-star"></i> ${formatVote(vote_average)}`;
  document.querySelector('.plot').textContent = overview;

  const productionCompanies = production_companies.map(company => company.name).join(', ');
  const otherDetailHTML = `
    <p class="ml-4">Country : ${country}</p>
    <p class="ml-4">Genre : ${genreHTML}</p>
    <p class="ml-4">Date Released : ${formatDate(release_date)}</p>
    <p class="ml-4">Production : ${productionCompanies}</p>
  `;

  document.querySelector('.other_details').innerHTML = otherDetailHTML;
}

window.addEventListener('load', () => {
  renderWatchMovie();
});