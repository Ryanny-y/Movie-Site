import { fetchMovieData } from "../../data/fetchMovie.js";
import { formatDate, formatVote, formatRunTime } from "./formatDate.js";

export async function renderRecommendation(id) {
  const url = new URL(window.location.href);
  const isSeries = url.toString().includes('series') ? 'tv' : 'movie';

  const showData = await fetchMovieData(`${isSeries}/${id}/recommendations`);
  const showList = showData.results.slice(0, 8);

  const recommendationHTML = (await Promise.all(showList.map(async show => {
    const details = await fetchMovieData(`${isSeries}/${show.id}`);
    const title = isSeries === 'tv' ? show.name : show.title;
    const runtime = isSeries === 'tv' ? `S ${details.number_of_seasons}/EP ${details.number_of_episodes}` : formatRunTime(details.runtime);

    return `
    <div class="recommended-movie flex flex-col gap-3 _${isSeries}" data-${isSeries}-id="${show.id}">
      <div class="h-80 w-full">
        <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="Movie Poster" class="w-full h-full">
      </div>
      <div class="flex items-center justify-between text-sm flex-wrap gap-1">
        <p class="text-base font-semibold">${title}</p>
        
        <span class="flex items-center gap-2">
          <p><i class="fa-solid fa-star text-yellow-400 text-xs"></i> ${formatVote(show.vote_average)}</p>
          <p><i class="far fa-clock text-xs"></i> ${runtime}</p>
        </span>
      </div>
    </div>
    `;
  }))).join('');

  document.querySelector('.recommendation-grid').innerHTML = recommendationHTML;
}

export async function renderReviews(id, reviewNum = 4) {
  const url = new URL(window.location.href);
  const isSeries = url.toString().includes('series') ? 'tv' : 'movie';

  const reviewData = await fetchMovieData(`${isSeries}/${id}/reviews`);
  const reviewList = reviewData.results.slice(0, reviewNum);

  const reviewHTML = reviewList.map(review => {
    const { author_details: {avatar_path: avatar, rating}, author, content, updated_at: date } = review;

    return `
    <div class="people-review flex flex-col sm:flex-row sm:items-center gap-8">
      <div class="w-20 h-20 sm:h-40 sm:w-40 flex-shrink-0">
        <img src="https://image.tmdb.org/t/p/w500${avatar}" alt="People avatar" class="w-full h-full rounded-full">
      </div>

      <div class="flex flex-col gap-2 flex-grow">
        <p>${author}</p>
        <p>${formatDate(date)}</p>
        <p class="text-sm">${content}</p>
        <p><i class="fa-solid fa-star text-yellow-400 text-xs"></i> ${formatVote(rating)}</p>
      </div>
    </div>
    `
  }).join(''); 

  document.querySelector('.review-container').innerHTML = reviewHTML;
  
  const reviewBtn = document.querySelector('.view-all-review');
  if(reviewData.results.length > 4) {
    reviewBtn.classList.remove('hidden');
  };

  if(reviewList.length > 4) {
    reviewBtn.classList.add('hidden');
  }

  reviewBtn.addEventListener('click', () => {
    renderReviews(id, reviewData.results.length);
  })
}