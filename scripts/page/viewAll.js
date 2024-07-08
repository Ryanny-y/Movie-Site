import { fetchMovieData } from '../../data/fetchMovie.js';
import { formatVote, formatRunTime } from '../utils/formatDate.js';
import { controlPage } from '../utils/pageControl.js';

const subdirectories = {
  'now-playing-movies': 'movie/now_playing',
  'trending-movies': 'trending/movie/week',
  'popular-movies': 'movie/popular',
  'popular-series': 'tv/popular',
  'discover-movies': 'discover/movie',
  'top-rated-movies': 'movie/top_rated',
  'upcoming-movies': 'movie/upcoming',
  'airing-today-tv': 'tv/airing_today',
  'on-the-air-tv': 'tv/on_the_air',
  'popular-tv': 'tv/popular',
  'top-rated-tv': 'tv/top_rated'
};

function renderContentMovies() {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const contentParam = params.get('content');
  const pageNumber = params.get('page');
  let subdir = '';
  for(let dir in subdirectories) {
    if(contentParam === dir) {
      subdir = subdirectories[dir];
      break;
    }
  }

  displayShow(subdir, pageNumber);
  const title = toTitleCase(contentParam);
  document.querySelector('.main-title h1').textContent = title;
}

async function displayShow(subdir, pageNumber) {
  let lang = 'language=en-US'
  if(subdir === 'trending/movie/week') {
    lang = '';
  }
  const isSeries = subdir.includes('tv');

  const getShow = await fetchMovieData(`${subdir}?${lang}&page=${pageNumber}`);
  const showResult = getShow.results;
  const showWrapperHTML = await Promise.all(showResult.map(async show => {
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
  controlPage(pageNumber);
}

function toTitleCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}


window.addEventListener('load', () => {
  renderContentMovies();
})