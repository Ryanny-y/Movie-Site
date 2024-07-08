export function controlPage(pageNumber) {
  const pageNumberEl = document.querySelector('.page-number');
  const prevBtn = document.querySelector('.prev-page-btn');
  const nextBtn = document.querySelector('.next-page-btn');
  pageNumberEl.textContent = pageNumber;
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  nextBtn.addEventListener('click', () => {
    const nextPage = Number(pageNumber) + 1;
    searchParams.set('page', nextPage);
    url.search = searchParams.toString();
    window.location.href = url.toString();
  });

  prevBtn.addEventListener('click', () => {
    if(pageNumber > 1) {
      const prevPage = Number(pageNumber) - 1;
      searchParams.set('page', prevPage);
      url.search = searchParams.toString();
      window.location.href = url.toString();
    }
  });
}