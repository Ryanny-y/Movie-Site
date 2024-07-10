
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

export function showSeriesDetail() {
  const movieContainers = document.querySelectorAll('._tv');

  movieContainers.forEach(el => {
    el.removeEventListener('click', handleClick2);
  });

  movieContainers.forEach(el => {
    el.addEventListener('click', handleClick2);
  });
}

function handleClick2() {
  const { tvId } = this.dataset;
  const dirPath = document.title === 'R***ny Movies' ? `page/watch/watch_series.html?id=${tvId}&season=1&episode=1` 
  : document.title === 'Watch Series' ? `../watch/watch_series.html?id=${tvId}&season=1&episode=1`
  :`./watch/watch_series.html?id=${tvId}&season=1&episode=1`;
  
  window.open(dirPath, '_blank');
}