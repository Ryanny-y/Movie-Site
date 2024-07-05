class Sliders {
  nowPlayingSlider() {
    const data = this.data('.now-playing', '.swiper.now-playing-movies', 4)
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

  data(section, wrapper, preview) {
    return {
      section,
      wrapper,
      preview
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
          spaceBetween: 40,
        },
      },
    });

    nowPlayingSwiper.on('slideChange', () => {
      const sliderNav = document.querySelector(`${data.section} .slider-nav`);
      const viewAllButton = sliderNav.querySelector('.view-all');
  
      if (nowPlayingSwiper.isEnd) {
        if (!viewAllButton) {
          const viewBtn = document.createElement('a');
          viewBtn.href = '';
          viewBtn.classList.add('view-all');
          viewBtn.textContent = 'View All';
          sliderNav.appendChild(viewBtn);
        }
      } else {
        if (viewAllButton) {
          viewAllButton.remove();
        }
      }
    });
  }
}

export const sliders = new Sliders();