import dayjs from 'https://unpkg.com/dayjs@1.11.11/esm/index.js';

export const formatDate = (date) => dayjs(date).format('MM/DD/YY');

export const formatRunTime = (runtime) => {
  let hours = Math.floor(runtime / 60);
  let minutes = runtime % 60;

  return `${hours}:${minutes}:00`;
}

export const formatVote = (vote) => vote ? vote.toFixed(1) : `No Rating`; 