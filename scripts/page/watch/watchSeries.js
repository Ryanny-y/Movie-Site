import { fetchMovieData } from '../../../data/fetchMovie.js';
import { fetchVideo } from '../../../data/fetchVideo.js';
import { formatRunTime, formatDate, formatVote } from '../../utils/formatDate.js';
import { showSeriesDetail } from '../../utils/movieDetail.js';
import { searchBar } from '../../utils/searchBar.js';
import { renderRecommendation, renderReviews } from '../../utils/recomReview.js';

async function renderWatchSeries() {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const id = params.get('id');

  searchBar();
  await displaySeriesDetail(id);
  await displaySeasonEpisodes(id);
  await renderRecommendation(id);
  await renderReviews(id);
  showSeriesDetail();

};

async function loadVideo(id, season, episode) {
  try {
    const video = await fetchVideo(`tv?tmdb=${id}&season=${season}&episode=${episode}`);
    const videoContainer = document.querySelector('.video-container iframe');
    videoContainer.src = video.url;
  } catch (error) {
    console.log(err);
  }
};

async function displaySeriesDetail(id) {
  const details = await fetchMovieData(`tv/${id}`);
  const { poster_path: img, 
          name, 
          genres,
          first_air_date,
          number_of_episodes,
          number_of_seasons,
          vote_average, 
          overview,  
          production_countries: [{ name: country }],
          production_companies } = details;

  const genreHTML1 = genres.slice(0,3).map(genre => {
    return `
      <p class="bg-white p-2 rounded-md ">${genre.name}</p>
    `
  }).join('');
  const genreHTML = genres.slice(0, 3).map(genre => genre.name).join(', ');

  document.querySelector('.series-poster img').src = `https://image.tmdb.org/t/p/w500${img}`
  document.querySelector('.details .title').textContent = name;
  document.querySelector('.genres').innerHTML = genreHTML1;
  document.querySelector('.release_year').innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${first_air_date.split('').slice(0,4).join('')}`;
  document.querySelector('.runtime').innerHTML = `<i class="far fa-clock"></i> S ${number_of_seasons}/EP ${number_of_episodes}`;
  document.querySelector('.average').innerHTML = `<i class="fa-solid fa-star"></i> ${formatVote(vote_average)}`;
  document.querySelector('.plot').textContent = overview;

  const productionCompanies = production_companies.map(company => company.name).join(', ');
  const otherDetailHTML = `
    <p class="ml-4">Country : ${country}</p>
    <p class="ml-4">Genre : ${genreHTML}</p>
    <p class="ml-4">Date Released : ${formatDate(first_air_date)}</p>
    <p class="ml-4">Production : ${productionCompanies}</p>
  `;

  document.querySelector('.other_details').innerHTML = otherDetailHTML;
};

async function displaySeasonEpisodes(id) {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const season = params.get('season');
  const ep = params.get('episode');

  const details = await fetchMovieData(`tv/${id}`);
  const seasonDetails = await fetchMovieData(`tv/${id}/season/${Number(season)}`);
  const { episodes: number_of_episodes } = seasonDetails;
  const { number_of_seasons } = details;
  const seasons = Array.from({length: number_of_seasons});

  // SEASONS
  const seasonsHMTL = seasons.map((_, i) => {
    const val = i + 1;
    const selected = val === Number(season) ? 'selected' : '';
    return `<option value="${val}" ${selected} class="flex items-center gap-2 text-xs md:text-xl bg-black">Season ${val}<i class="fa-solid fa-chevron-down text-xl"></i></option>`
  }).join('');

  const seasonSelector = document.getElementById('season-selector');
  seasonSelector.innerHTML = seasonsHMTL;
  seasonSelector.addEventListener('change', (e) => {
    params.set('season', e.target.value);
    params.set('episode', 1);
    url.search = params.toString();
    const newURL = url.toString();
    window.location.href = newURL;
  });

  // EPISODES
  const episodesHMTL = number_of_episodes.map((_, i) => {
    const val = i + 1;
    const selected = val === Number(ep) ? 'selected' : '';
    return `<option value="${val}" ${selected} class="flex items-center gap-2 text-xs md:text-xl bg-black">Episode ${val}<i class="fa-solid fa-chevron-down text-xl"></i></option>`
  }).join('');

  const episodeSelector = document.getElementById('episodes-selector');
  episodeSelector.innerHTML = episodesHMTL;
  episodeSelector.addEventListener('change', (e) => {
    params.set('episode', e.target.value);
    url.search = params.toString();
    const newURL = url.toString();
    window.location.href = newURL;
  });

  loadVideo(id, season, ep);
}

window.addEventListener('load', () => {
  renderWatchSeries();
})
