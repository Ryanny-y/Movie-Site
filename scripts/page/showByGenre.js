import { fetchMovieData } from "../../data/fetchMovie.js";
import { controlPage } from '../utils/pageControl.js';
import { formatDate, formatVote, formatRunTime } from "../utils/formatDate.js";

function showByGenre() {

  renderShow();
  
}

async function renderShow() {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const genreName = params.get('genre-name');
  const genreId = params.get('genre-id');
  const pageNumber = params.get('page');
  const showType = params.get('show-type');
  const isSeries = showType === 'tv';

  const movieData = await fetchMovieData(`discover/${isSeries?'tv':'movie'}?include_adult=false&include_video=false&language=en-US&page=${pageNumber}&sort_by=popularity.desc&with_genres=${genreId}`);
  const movieResult = movieData.results;
  const showWrapperHTML = await Promise.all(movieResult.map(async show => {
    const detail = await fetchMovieData(`${isSeries ? 'tv' : 'movie'}/${show.id}`)
    const title = isSeries ? show.name : show.title;
    const runtime = isSeries ? `S ${detail.number_of_seasons}/EP ${detail.number_of_episodes}` : formatRunTime(detail.runtime);

    return `
    <div class="w-full rounded-md bg-gray-700">
      <div class="h-64">
        <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="movie poster" class="h-full w-full rounded-md">
      </div>

      <div class="details p-2 flex flex-col gap-2">
        <button class="flex items-center justify-center gap-1 text-center font-semibold bg-red py-2 text-sm rounded-sm"><i class="fa-solid fa-play"></i> Watch Trailer</button>
        <p>${title}</p>
        <div class="flex justify-between">
          <p class="flex items-center gap-1"><i class="fa-solid fa-star text-xs text-yellow-400"></i> ${formatVote(show.vote_average)}</p>
          <p class="flex items-center gap-1"><i class="far fa-clock text-xs"></i> ${runtime}</p>
        </div>
      </div>
    </div>`
  }));
  
  document.querySelector('.show-container').innerHTML = showWrapperHTML.join('');
  document.querySelector('.main-title h1').textContent = genreName;
  controlPage(pageNumber);
}


window.addEventListener('load', () => {
  showByGenre();
});