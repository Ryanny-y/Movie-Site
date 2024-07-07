class Sliders {
  nowPlayingSlider(preview, gap) {
    const data = this.data('.now-playing', '.swiper.now-playing-movies', preview, gap)
    this.initSlider(data);
  };

  trendingSlider() {
    const data = this.data('.trending', '.swiper.trending-movies', 3);
    this.initSlider(data);
  }

  popularMovieSlider() {
    const data = this.data('.popular-movies', '.swiper.popular-movies', 4);
    this.initSlider(data);
  }

  popularSeriesSlider() {
    const data = this.data('.popular-series', '.swiper.popular-series', 4);
    this.initSlider(data);
  }

  discoverMovieSlider() {
    const data = this.data('.discover', '.swiper.discover-movie', 4, 40,true);
    this.initSlider(data);
  }

  movieList(detail, preview, gap) {
    const data = this.data(`.${detail.sectionClass}`, `.swiper.${detail.content}`, preview, gap)
    this.initSlider(data);
  }

  data(section, wrapper, preview, gap = 40, style = false) {
    return {
      section,
      wrapper,
      preview,
      gap,
      style
    }
  }

  initSlider(data) {
    const nowPlayingSwiper = new Swiper(data.wrapper, {
      // Navigation arrows
      navigation: {
        nextEl: `${data.section} .swiper-next`,
        prevEl: `${data.section} .swiper-prev`,
      },
      slidesPerView: 1,
      breakpoints: {
        400: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: data.preview,
          spaceBetween: data.gap,
        },
      },
      ...(data.style && {
        grid: {
          rows: 2,
          fill: 'rows',
        },
      })
    });
    
    nowPlayingSwiper.on('slideChange', () => {
      const sliderNav = document.querySelector(`${data.section} .slider-nav`);
      const viewAllButton = sliderNav.querySelector('.view-all');
  
      if (nowPlayingSwiper.isEnd) {
        viewAllButton.classList.remove('hidden');
      } else {
        viewAllButton.classList.add('hidden');
      }
    });
  }
}

export const sliders = new Sliders();