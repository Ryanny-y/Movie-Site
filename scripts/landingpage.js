import { sliders } from "./utils/sliders.js";
import { fetchMovieData } from "../data/fetchMovie.js";
import { formatDate, formatRunTime, formatVote } from "./utils/formatDate.js";
import { searchBar } from './utils/searchBar.js';
import { showMovieDetail } from "./utils/movieDetail.js";

async function renderLandingPage() {
  
  await nowPlayingMovies();
  await trendingMovies();
  await popularMovies();
  await popularSeries();
  await discoverMovie();
  searchBar();
  showMovieDetail();
};

async function nowPlayingMovies() {
  const getMovie = await fetchMovieData('movie/now_playing');
  const movieList = getMovie.results;
  const filteredList = movieList.slice(0, 8);

  const nowPlayingHTML = filteredList.map(movie => {
    return `
    <div class="swiper-slide _movie" style="height: auto !important;" data-movie-id="${movie.id}">
      <div class="movie flex items-center gap-6 h-full">
        <div class="w-16 h-24">
          <img src="https://image.tmdb.org/t/p/w500${movie['poster_path']}" alt="" class="h-full w-full max-w-full rounded-sm">
        </div>
        <div class="details flex flex-col gap-1 text-sm">
          <p class="title">${movie.title}</p>
          <p class="type">Movie</p>
          <p>${formatDate(movie['release_date'])}</p>
        </div>
      </div>
    </div>`
  }).join('');

  document.querySelector('.now-playing-movies .swiper-wrapper').innerHTML = nowPlayingHTML;
  sliders.nowPlayingSlider(4);
}

async function trendingMovies() {
  const getMovie = await fetchMovieData('trending/movie/week');
  const movieList = getMovie.results;
  const filteredList = movieList.slice(0, 12);

  const trendingMovieHTML = await Promise.all(filteredList.map(async movie => {
    const data = await fetchMovieData(`movie/${movie.id}`);
    const genres = data.genres.slice(0, 3);
    const { runtime } = data;
    const formatTime = formatRunTime(runtime);

    const genreNames = genres.map(genre => {
      return genre.name;
    })
    const genreHTML = genreNames.map(name => {
      return `<p class="bg-red p-2 rounded-lg">${name}</p>`;
    }).join('');

    return `
    <div class="swiper-slide _movie" style="height: auto !important;" data-movie-id="${movie.id}">
      <div class="movie flex flex-col gap-2 justify-between h-full relative">
        <p class="absolute top-3 left-3 text-xs"><i class="far fa-clock"></i> ${formatTime}</p>
        <p class="absolute top-3 right-3 text-xs"><i class="fa-solid fa-star text-yellow-400"></i> ${formatVote(movie['vote_average'])}</p>

        <div class="h-72 w-full">
          <img src="https://image.tmdb.org/t/p/w500${movie['poster_path']}" alt="" class="h-full w-full max-w-full rounded-md">
        </div>
    
        <div class="detail flex flex-col gap-2 justify-between flex-grow">
          <p class="title font-semibold text-xl 2xl:text-2xl">${movie.title}</p>
    
          <div class="genre text-center text-xs flex items-center gap-2">
            ${genreHTML}
          </div>
        </div>
      </div>
    </div>
    `;
  }));

  document.querySelector('.trending-movies .swiper-wrapper').innerHTML = trendingMovieHTML.join('');
  sliders.trendingSlider();
} 

async function popularMovies() {
  const getMovie = await fetchMovieData('movie/popular');
  const movieList = getMovie.results;
  const filteredList = movieList.slice(0, 12);
  
  const popularMovieHTML = await Promise.all(filteredList.map(async movie => {
    const data = await fetchMovieData(`movie/${movie.id}`);
    const { runtime } = data;
    
    return `
    <div class="swiper-slide _movie" style="height: auto !important;" data-movie-id="${movie.id}">
      <div class="movie flex flex-col gap-2 justify-between h-full relative">
        <div class="h-80 w-full">
          <img src="https://image.tmdb.org/t/p/w500${movie['poster_path']}" alt="" class="h-full w-full max-w-full rounded-md">
        </div>
    
        <div class="detail flex items-start justify-between flex-grow flex-wrap">
          <p class="title font-semibold text-xl 2xl:text-2xl">${movie.title}</p>

          <div class="genre text-end text-xs flex items-center pt-2 gap-2">
            <p><i class="fa-solid fa-star text-yellow-400"></i> ${formatVote(movie['vote_average'])}</p>
            <p><i class="far fa-clock"></i> ${formatRunTime(runtime)}</p>
          </div>
        </div>
      </div>
    </div>`;
  }));
  document.querySelector('.swiper.popular-movies .swiper-wrapper').innerHTML = popularMovieHTML.join('');
  sliders.popularMovieSlider()
}

async function popularSeries() {
  const getSeries = await fetchMovieData('tv/popular');
  const seriesList = getSeries.results;
  const filteredList = seriesList.slice(0, 12);
  
  const popularSeriesHTML = await Promise.all(filteredList.map(async series => {
    const data = await fetchMovieData(`tv/${series.id}`);
    const { number_of_seasons: season, number_of_episodes: episodes } = data;
    
    return `
    <div class="swiper-slide _tv" style="height: auto !important;">
      <div class="series flex flex-col gap-2 justify-between h-full relative">
        <div class="h-80 w-full">
          <img src="https://image.tmdb.org/t/p/w500${series['poster_path']}" alt="" class="h-full w-full max-w-full rounded-md">
        </div>
    
        <div class="detail flex items-start justify-between flex-grow flex-wrap">
          <p class="title font-semibold text-xl 2xl:text-2xl">${series.name}</p>

          <div class="genre text-end text-xs flex items-center pt-2 gap-2">
            <p><i class="fa-solid fa-star text-yellow-400"></i> ${formatVote(series['vote_average'])}</p>
            <p>Series/S ${season}/EP ${episodes}</p>
          </div>
        </div>
      </div>
    </div>`;
  }));
  document.querySelector('.swiper.popular-series .swiper-wrapper').innerHTML = popularSeriesHTML.join('');

  sliders.popularSeriesSlider();
}

async function discoverMovie() {
  const getMovies = await fetchMovieData('discover/movie');
  const movieList = getMovies.results;

  const discoverMovieHTML = await Promise.all(movieList.map(async movie => {
    const data = await fetchMovieData(`movie/${movie.id}`);
    const { runtime } = data;
    
    return `
    <div class="swiper-slide _movie" style="height: auto !important;" data-movie-id="${movie.id}">
      <div class="movie flex flex-col gap-2 justify-between h-full relative">
        <div class="h-80 w-full">
          <img src="https://image.tmdb.org/t/p/w500${movie['poster_path']}" alt="" class="h-full w-full max-w-full rounded-md">
        </div>
    
        <div class="detail flex items-start justify-between flex-grow flex-wrap">
          <p class="title font-semibold text-xl 2xl:text-2xl">${movie.title}</p>

          <div class="genre text-end text-xs flex items-center pt-2 gap-2">
            <p><i class="fa-solid fa-star text-yellow-400"></i> ${formatVote(movie['vote_average'])}</p>
            <p><i class="far fa-clock"></i> ${formatRunTime(runtime)}</p>
          </div>
        </div>
      </div>
    </div>`;
  }));
  document.querySelector('.swiper.discover-movie .swiper-wrapper').innerHTML = discoverMovieHTML.join('');
  sliders.discoverMovieSlider();
}

renderLandingPage();