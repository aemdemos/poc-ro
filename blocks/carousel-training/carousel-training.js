import { fetchPlaceholders } from '../../scripts/placeholders.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function showDetails(block, slideIndex) {
  const detailPanel = block.querySelector('.carousel-training-detail-panel');
  if (!detailPanel) return;

  const details = detailPanel.querySelectorAll('.carousel-training-detail');
  details.forEach((detail, idx) => {
    detail.hidden = idx !== slideIndex;
  });

  detailPanel.hidden = false;
  block.classList.add('detail-open');
}

function hideDetails(block) {
  const detailPanel = block.querySelector('.carousel-training-detail-panel');
  if (detailPanel) detailPanel.hidden = true;
  block.classList.remove('detail-open');

  block.querySelectorAll('.carousel-training-slide').forEach((slide) => {
    slide.classList.remove('active');
  });
}

function bindEvents(block) {
  const slidesWrapper = block.querySelector('.carousel-training-slides');
  const firstSlide = block.querySelector('.carousel-training-slide');
  if (!firstSlide) return;

  const getSlideStep = () => {
    const gap = parseInt(getComputedStyle(slidesWrapper).gap, 10) || 0;
    return firstSlide.offsetWidth + gap;
  };

  block.querySelector('.slide-prev')?.addEventListener('click', () => {
    slidesWrapper.scrollBy({ left: -getSlideStep(), behavior: 'smooth' });
  });
  block.querySelector('.slide-next')?.addEventListener('click', () => {
    slidesWrapper.scrollBy({ left: getSlideStep(), behavior: 'smooth' });
  });

  // Read more links
  block.querySelectorAll('.carousel-training-readmore').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const slide = link.closest('.carousel-training-slide');
      const idx = parseInt(slide.dataset.slideIndex, 10);
      const wasActive = slide.classList.contains('active');

      // Deactivate all slides
      block.querySelectorAll('.carousel-training-slide').forEach((s) => {
        s.classList.remove('active');
      });

      if (wasActive) {
        hideDetails(block);
      } else {
        slide.classList.add('active');
        showDetails(block, idx);
      }
    });
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-training-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-training-slide');

  // First column is the slide card content
  const columns = row.querySelectorAll(':scope > div');
  const cardColumn = columns[0];
  if (cardColumn) {
    cardColumn.classList.add('carousel-training-slide-content');
    slide.append(cardColumn);
  }

  // Add "Read more" link at the bottom of the slide
  const readMore = document.createElement('a');
  readMore.href = '#';
  readMore.classList.add('carousel-training-readmore');
  readMore.textContent = 'Read more';
  slide.append(readMore);

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

function createDetailPanel(rows) {
  const panel = document.createElement('div');
  panel.classList.add('carousel-training-detail-panel');
  panel.hidden = true;

  rows.forEach((row, idx) => {
    const columns = row.querySelectorAll(':scope > div');
    const detailColumn = columns[1];

    const detail = document.createElement('div');
    detail.classList.add('carousel-training-detail');
    detail.hidden = idx !== 0;

    // Read duration and location from column 1 (paragraphs after em subheader)
    const cardColumn = columns[0];
    let duration = '';
    let location = '';
    if (cardColumn) {
      const paragraphs = cardColumn.querySelectorAll('p');
      // Structure: p>em (subheader), p (duration), p (location), p (description)
      paragraphs.forEach((para) => {
        const text = para.textContent.trim();
        if (para.querySelector('em')) return; // skip subheader
        if (!duration && text && !location) {
          duration = text;
        } else if (duration && !location && text) {
          location = text;
        }
      });
    }

    if (detailColumn) {
      // Extract image, h4, and text paragraph from the details column
      // Structure: <p><img></p> <h4>title</h4> <p>text</p>
      const img = detailColumn.querySelector('img');
      const h4 = detailColumn.querySelector('h4');
      // Get the paragraph after the h4 (skip the one wrapping the img)
      const p = h4 ? h4.nextElementSibling : null;

      const leftCol = document.createElement('div');
      leftCol.classList.add('carousel-training-detail-left');

      if (img) {
        const imgWrap = document.createElement('div');
        imgWrap.classList.add('carousel-training-detail-image');
        imgWrap.append(img);
        leftCol.append(imgWrap);
      }

      // Duration and location below image
      if (duration || location) {
        const metaWrap = document.createElement('div');
        metaWrap.classList.add('carousel-training-detail-meta');
        if (duration) {
          const d = document.createElement('span');
          d.classList.add('carousel-training-detail-duration');
          d.textContent = duration;
          metaWrap.append(d);
        }
        if (location) {
          const l = document.createElement('span');
          l.classList.add('carousel-training-detail-location');
          l.textContent = location;
          metaWrap.append(l);
        }
        leftCol.append(metaWrap);
      }

      detail.append(leftCol);

      const textWrap = document.createElement('div');
      textWrap.classList.add('carousel-training-detail-text');
      if (h4) textWrap.append(h4);
      if (p && p.tagName === 'P') textWrap.append(p);
      detail.append(textWrap);
    }

    panel.append(detail);
  });

  return panel;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-training-${carouselId}`);
  const rows = [...block.querySelectorAll(':scope > div')];
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-training-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-training-slides');
  block.prepend(slidesWrapper);

  // Build detail panel from second columns before rows are removed
  const detailPanel = createDetailPanel(rows);

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-training-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    // Navigation bar: detail panel + nav buttons
    const navBar = document.createElement('div');
    navBar.classList.add('carousel-training-nav-bar');

    navBar.append(detailPanel);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-training-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;
    navBar.append(slideNavButtons);

    block.append(navBar);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-training-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}
