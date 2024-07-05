import dayjs from 'https://unpkg.com/dayjs@1.11.11/esm/index.js';

export const formatDate = (date) => dayjs(date).format('MM/DD/YY');