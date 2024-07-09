import { fetchMovieData } from '../../../data/fetchMovie.js';
import { fetchVideo } from '../../../data/fetchVideo.js';
import { formatRunTime, formatDate, formatVote } from '../../utils/formatDate.js';
import { showMovieDetail } from '../../utils/movieDetail.js';
import { searchBar } from '../../utils/searchBar.js';

async function renderWatchMovie() {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const id = params.get('id');
  
  searchBar();
  loadVideo(id)
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

async function renderRecommendation(id) {
  const movieData = await fetchMovieData(`movie/${id}/recommendations`);
  const movieList = movieData.results.slice(0, 8);

  const recommendationHTML = (await Promise.all(movieList.map(async movie => {
    const details = await fetchMovieData(`movie/${movie.id}`);
    const { runtime } = details;

    return `
    <div class="recommended-movie flex flex-col gap-3 _movie" data-movie-id="${movie.id}">
      <div class="h-80 w-full">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="Movie Poster" class="w-full h-full">
      </div>
      <div class="flex items-center justify-between text-sm flex-wrap gap-1">
        <p class="text-base font-semibold">${movie.title}</p>
        
        <span class="flex items-center gap-2">
          <p><i class="fa-solid fa-star text-yellow-400 text-xs"></i> ${formatVote(movie.vote_average)}</p>
          <p><i class="far fa-clock text-xs"></i> ${formatRunTime(runtime)}</p>
        </span>
      </div>
    </div>
    `;
  }))).join('');

  document.querySelector('.recommendation-grid').innerHTML = recommendationHTML;
}

async function renderReviews(id, reviewNum = 4) {
  const reviewData = await fetchMovieData(`movie/${id}/reviews`);
  const reviewList = reviewData.results.slice(0, reviewNum);

  const reviewHTML = reviewList.map(review => {
    const { author_details: {avatar_path: avatar, rating}, author, content, updated_at: date } = review;

    return `
    <div class="people-review flex flex-col sm:flex-row sm:items-center gap-8">
      <div class="w-20 h-20 sm:h-40 sm:w-40 flex-shrink-0">
        <img src="https://image.tmdb.org/t/p/w500${avatar}" alt="People avatar" class="w-full h-full rounded-full">
      </div>

      <div class="flex flex-col gap-2 flex-grow">
        <p>${author}</p>
        <p>${formatDate(date)}</p>
        <p class="text-sm">${content}</p>
        <p><i class="fa-solid fa-star text-yellow-400 text-xs"></i> ${formatVote(rating)}</p>
      </div>
    </div>
    `
  }).join(''); 

  document.querySelector('.review-container').innerHTML = reviewHTML;
  
  const reviewBtn = document.querySelector('.view-all-review');
  if(reviewData.results.length > 4) {
    reviewBtn.classList.remove('hidden');
  };

  if(reviewList.length > 4) {
    reviewBtn.classList.add('hidden');
  }

  reviewBtn.addEventListener('click', () => {
    renderReviews(id, reviewData.results.length);
  })
}

window.addEventListener('load', () => {
  renderWatchMovie();
});