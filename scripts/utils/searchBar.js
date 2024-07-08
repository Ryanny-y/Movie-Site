import { fetchMovieData } from '../../data/fetchMovie.js';
import { formatRunTime } from './formatDate.js';

export function searchBar() {
  const searchinput = document.querySelector('.search-input');
  const searchBtn = document.querySelector('.search-btn');

  searchBtn.addEventListener('click', () => {
    const inputValue = searchinput.value;
    searchMovie(inputValue);
    const dirPath = document.title === 'R***ny Movies' ? 'page/' : './';
    window.open(`${dirPath}search-movie.html?search=${inputValue}&page=1`)
  });

  searchinput.addEventListener('keyup', async (e) => {
    const val = e.target.value;
    const searchContainer = document.querySelector('.searched-movies');
    if(e.key === 'Enter') {
      searchMovie(val);
      const dirPath = document.title === 'R***ny Movies' ? 'page/' : './';
      window.open(`${dirPath}search-movie.html?search=${val}&page=1`)
    }

    if(val) {
      await searchMovie(val);
      searchContainer.classList.remove('hidden');
    } else {
      searchContainer.classList.add('hidden');
    }
  });
};

async function searchMovie(inputVal) {
  const movieData = await fetchMovieData(`search/movie?query=${inputVal}&include_adult=false&language=en-US&page=1`);
  const searchList = movieData.results;
  const filteredList = searchList.slice(0, 5);

  const searchMoviesHTML = await Promise.all(filteredList.map(async movie => {
    const detail = await fetchMovieData(`movie/${movie.id}`);

    return `
      <div class="search-container flex gap-2 bg-white rounded-md py-2 px-3">
        <img src="https://image.tmdb.org/t/p/w500${movie['poster_path']}" alt="Movie Thumbnail" class="h-16 w-14">
        <div class="flex flex-col gap-1">
          <p class="text-base">${movie.title}</p>
          <p class="text-base">${formatRunTime(detail.runtime)}</p>
        </div>
      </div>    
    `
  }));

  document.querySelector('.searched-movies').innerHTML = searchMoviesHTML.join('');
}