import { fetchMovieData } from "../../data/fetchMovie.js";
import { controlPage } from '../utils/pageControl.js';
import { formatVote, formatRunTime } from "../utils/formatDate.js";
import { searchBar } from '../utils/searchBar.js';
import { showMovieDetail } from "../utils/movieDetail.js";

async function showByGenre() {
  searchBar();
  await renderShow();
  showMovieDetail();
}

async function renderShow() {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const search = params.get('search');
  const pageNumber = params.get('page');

  const movieData = await fetchMovieData(`search/movie?query=${search}&include_adult=false&language=en-US&page=${pageNumber}`);
  const movieResult = movieData.results;
  const showWrapperHTML = await Promise.all(movieResult.map(async show => {
    const detail = await fetchMovieData(`movie/${show.id}`)
    const title =  show.title;
    const runtime = formatRunTime(detail.runtime);

    return `
    <div class="w-full rounded-md bg-gray-700 _movie" data-movie-id=${show.id}>
      <div class="h-64">
        <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="movie poster" class="h-full w-full rounded-md">
      </div>

      <div class="details p-2 flex flex-col gap-2">
        <button class="flex items-center justify-center gap-1 text-center font-semibold bg-red py-2 text-sm rounded-sm"><i class="fa-solid fa-play"></i> Watch Now</button>
        <p>${title}</p>
        <div class="flex justify-between">
          <p class="flex items-center gap-1"><i class="fa-solid fa-star text-xs text-yellow-400"></i> ${formatVote(show.vote_average)}</p>
          <p class="flex items-center gap-1"><i class="far fa-clock text-xs"></i> ${runtime}</p>
        </div>
      </div>
    </div>`
  }));
  
  document.querySelector('.show-container').innerHTML = showWrapperHTML.join('');
  document.querySelector('.main-title h1').textContent = `Search Result for ${search.replace(search.charAt(0), search.charAt(0).toUpperCase())}`;
  controlPage(pageNumber);
}


window.addEventListener('load', () => {
  showByGenre();
});