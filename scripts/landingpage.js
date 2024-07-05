import { sliders } from "./utils/sliders.js";
import { fetchMovieData } from "../data/fetchMovie.js";
import { formatDate } from "./utils/formatDate.js";

async function renderLandingPage() {
  
  nowPlayingMovies();
  trendingMovies();
};

async function nowPlayingMovies() {
  const getMovie = await fetchMovieData('movie/now_playing');
  const movieList = getMovie.results;
  const filteredList = movieList.slice(0, 8);

  const nowPlayingHTML = filteredList.map(movie => {
    return `
    <div class="swiper-slide" style="height: auto !important; max-height: 80px;">
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
  sliders.nowPlayingSlider();
}

async function trendingMovies() {
  const getMovie = await fetchMovieData('trending/movie/week');
  const movieList = getMovie.results;
  const filteredList = movieList.slice(0, 12);

  const trendingMovieHTML = await Promise.all(filteredList.map(async movie => {
    const data = await fetchMovieData(`movie/${movie.id}`);
    const genres = data.genres.slice(0, 3);
    const genreNames = genres.map(genre => {
      return genre.name;
    })
    const genreHTML = genreNames.map(name => {
      return `<p class="bg-red p-2 rounded-lg">${name}</p>`;
    }).join('');

    return `
    <div class="swiper-slide" style="height: auto !important;">
      <div class="movie flex flex-col gap-2 justify-between h-full">
        <div class="h-80 w-full">
          <img src="https://image.tmdb.org/t/p/w500${movie['poster_path']}" alt="" class="h-full w-full max-w-full rounded-sm">
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

renderLandingPage();