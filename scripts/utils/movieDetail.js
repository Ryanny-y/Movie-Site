
export function showMovieDetail() {
  const movieContainers = document.querySelectorAll('._movie');

  movieContainers.forEach(el => {
    el.removeEventListener('click', handleClick);
  });

  movieContainers.forEach(el => {
    el.addEventListener('click', handleClick);
  });

}

function handleClick() {
  const { movieId } = this.dataset;
  const dirPath = document.title === 'R***ny Movies' ? `page/watch/watch_movie.html?id=${movieId}` 
  : document.title === 'Watch Movie' ? `../watch/watch_movie.html?id=${movieId}`
  :`./watch/watch_movie.html?id=${movieId}`;
  
  window.open(dirPath, '_blank');
}