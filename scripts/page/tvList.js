import { sliders } from '../utils/sliders.js';
import { fetchMovieData } from '../../data/fetchMovie.js';
import { formatVote } from '../utils/formatDate.js';
import { searchBar } from '../utils/searchBar.js';
import { showSeriesDetail } from '../utils/movieDetail.js';

const dataList = [
  {
    sectionClass: 'airing-today',
    title: 'Airing Today TV Series',
    content: 'airing-today-tv',
    subdir: 'tv/airing_today?language=en-US&page=',
  },
  {
    sectionClass: 'on-the-air',
    title: 'On The Air TV Series',
    content: 'on-the-air-tv',
    subdir: 'tv/on_the_air?language=en-US&page=1',
  },
  {
    sectionClass: 'popular',
    title: 'Popular TV Series',
    content: 'popular-tv',
    subdir: 'tv/popular?language=en-US&page=1',
  },
  {
    sectionClass: 'top-rated',
    title: 'Top Rated',
    content: 'top-rated-tv',
    subdir: 'tv/top_rated?language=en-US&page=1'
  }
]

function renderMovieList() {
  searchBar();
  dataList.forEach(async data => {
    await renderSectionContent(data);
    showSeriesDetail();
  });
}

async function renderSectionContent(data) {
  const swiperHTML = await nowPlayingMovies(data);

  const sectionContentHTML = `
    <div class="container text-white flex flex-col items-start">
      <div class="w-full relative">
        <h1 class="section-title font-semibold text-xl 2xl:text-2xl w-full">${data.title}</h1>
        
        <div class="slider-nav flex items-center gap-2 text-white absolute top-0 right-0">
          <button class="swiper-prev text-white text-lg"><i class="fa-solid fa-chevron-left"></i></button>
          <button class="swiper-next text-white text-lg"><i class="fa-solid fa-chevron-right"></i></button>
          <a href="./all-movies.html?content=${data.content}&page=1" class="view-all hidden">View All</a>
        </div>
      </div>

      <div class="swiper ${data.content} mt-5 2xl:mt-6 w-full">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
            ${swiperHTML}
        </div>
      </div>
    </div>
  `;

  document.querySelector(`.${data.sectionClass}`).innerHTML = sectionContentHTML;
  sliders.movieList(data, 5, 20);
}

async function nowPlayingMovies(data) {
  const getSeries = await fetchMovieData(data.subdir);
  const seriesList = getSeries.results;
  
  const swiperSlides = await Promise.all(seriesList.map(async tv => {
    const detail = await fetchMovieData(`tv/${tv.id}`);
    console.log(detail);

    return `
    <div class="swiper-slide _tv" style="height: auto !important;" data-tv-id=${tv.id}>
      <div class="h-full rounded-md bg-gray-700">
        <div class="h-64">
          <img src="https://image.tmdb.org/t/p/w500${tv.poster_path}" alt="movie poster" class="h-full w-full rounded-md">
        </div>
  
        <div class="details p-2 flex flex-col gap-2">
          <button class="flex items-center justify-center gap-1 text-center font-semibold bg-red py-2 text-sm rounded-sm"><i class="fa-solid fa-play"></i> Watch Now</button>
          <p>${tv.name}</p>
          <div class="flex justify-between">
            <p class="flex items-center gap-1"><i class="fa-solid fa-star text-xs text-yellow-400"></i> ${formatVote(tv.vote_average)}</p>
            <p class="flex items-center gap-1"><i class="fa-solid fa-star text-xs text-yellow-400"></i> S ${detail.number_of_seasons}/EP ${detail.number_of_episodes}</p>
          </div>
        </div>
      </div>
    </div>
    `
  }));
  return swiperSlides.join('');
}

window.addEventListener('DOMContentLoaded', () => {
  renderMovieList();
})