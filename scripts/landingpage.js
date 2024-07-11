import { sliders } from "./utils/sliders.js";
import { fetchMovieData } from "../data/fetchMovie.js";
import { formatDate, formatRunTime, formatVote } from "./utils/formatDate.js";
import { searchBar } from './utils/searchBar.js';
import { showMovieDetail, showSeriesDetail } from "./utils/movieDetail.js";

async function renderLandingPage() {
  searchBar();
  await heroMovies();
  await nowPlayingMovies();
  await trendingMovies();
  await popularMovies();
  await popularSeries();
  await discoverMovie();
  showMovieDetail();
  showSeriesDetail();
};

async function heroMovies() {
  try {
    const getMovie = await fetchMovieData('movie/top_rated');
    const movieList = getMovie.results;
    const filteredList = movieList.slice(0, 5);

    const heroHTML = (await Promise.all(filteredList.map(async movie => {
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
// add comment
      return `
      <div class="swiper-slide relative">
        <div class="absolute top-0 h-full left-0 w-full" style="background: url('https://image.tmdb.org/t/p/w500${movie['poster_path']}') center / auto no-repeat;"></div>
        <div class="absolute top-0 h-full left-0 w-full" style="background: rgba(0,0,0,.4);"></div>

        <div class="absolute top-0 left-0 right-0 container h-full flex flex-col justify-end py-5 gap-5 sm:gap-20 z-20">
          <div class="watch-btns flex flex-wrap items-center gap-5 md:gap-11 justify-center">
            <a href="page/watch/watch_movie.html?id=${movie.id}" target="_blank" class="flex items-center justify-center gap-2 bg-red text-white p-5 font-bold rounded-md">
              <p class="text-nowrap">Watch Now</p>
              <i class="fa-solid fa-circle-play text-white text-xl"></i>
            </a>
          </div>

          <div class="movie-details flex flex-col gap-3 w-full lg:w-1/2">
            <h1 class="title font-bold text-3xl">${movie.title}</h1>

            <div class="other flex flex-col lg:flex-row lg:items-center gap-4">
              <div class="genre font-bold text-xs sm:text-base 2xl:text-base flex items-center gap-2">
                ${genreHTML}
              </div>

              <div class="flex items-center gap-4 text-white text-sm 2xl:text-base">
                <p><i class="fa-solid fa-calendar-days text-xs"></i> ${movie['release_date'].slice(0, 4)}</p>
                <p><i class="fa-solid fa-clock text-xs"></i> ${formatTime}</p>
                <p><i class="fa-solid fa-star text-xs text-yellow-400"></i> ${formatVote(movie.vote_average)}</p>
              </div>
            </div>

            <p class="plot text-sm 2xl:text-base text-justify">Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.</p>
          </div>
        </div>
      </div>
      `
    }))).join('');

    document.querySelector('.swiper.hero .swiper-wrapper').innerHTML = heroHTML;

    sliders.heroSlider();
  } catch (error) {
    
  }
}

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
    <div class="swiper-slide _tv" style="height: auto !important;" data-tv-id="${series.id}">
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