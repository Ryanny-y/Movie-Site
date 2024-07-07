import { sliders } from '../utils/sliders.js';
import { fetchMovieData } from '../../data/fetchMovie.js';
import { formatRunTime, formatVote } from '../utils/formatDate.js';

function renderMovieList() {

  nowPlayingMovies();
}

const dataList = [
  {
    title: ''
  }
]

async function nowPlayingMovies() {
  const getMovie = await fetchMovieData('movie/now_playing');
  const movieList = getMovie.results;
  
  const nowPlayingHTML = await Promise.all(movieList.map(async movie => {
    const detail = await fetchMovieData(`movie/${movie.id}`);

    return `
    <div class="swiper-slide" style="height: auto !important;">
      <div class="h-full rounded-md bg-gray-700">
        <div class="h-64">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="movie poster" class="h-full w-full rounded-md">
        </div>
  
        <div class="details p-2 flex flex-col gap-2">
          <button class="flex items-center justify-center gap-1 text-center font-semibold bg-red py-2 text-sm rounded-sm"><i class="fa-solid fa-play"></i> Watch Trailer</button>
          <p>${movie.title}</p>
          <div class="flex justify-between">
            <p class="flex items-center gap-1"><i class="fa-solid fa-star text-xs text-yellow-400"></i> ${formatVote(movie.vote_average)}</p>
            <p class="flex items-center gap-1"><i class="far fa-clock text-xs"></i> ${formatRunTime(detail.runtime)}</p>
          </div>
        </div>
      </div>
    </div>
    `
  }));
  document.querySelector('.now-playing-movies .swiper-wrapper').innerHTML = nowPlayingHTML.join('')
  sliders.nowPlayingSlider(5, 20)
}

window.addEventListener('DOMContentLoaded', () => {
  renderMovieList();
})