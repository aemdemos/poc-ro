/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-training block (roles-finder template)
 *
 * Source: https://recruitment.raf.mod.uk/roles/...
 * Base Block: carousel
 *
 * Block Structure (per slide row, two columns):
 * - Col 1: count + title (h3), subheader (em), duration, location, description
 * - Col 2: more-details image, title (h4), paragraph
 *
 * Output Structure (EDS):
 * ## Heading
 * <intro paragraph>
 * [Carousel Training block table]
 *   Row per slide: [slide text] | [more-details content]
 * Section Metadata: dark
 *
 * Generated: 2026-03-06
 * Updated: 2026-03-10 - Added second column for more-details content
 */
export default function parse(element, { document }) {
  const fragment = document.createDocumentFragment();

  // --- Section heading (h2) ---
  const heading = element.querySelector('.hero-container h2') ||
    element.querySelector('h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    fragment.appendChild(h2);
  }

  // --- Intro paragraph ---
  const intro = element.querySelector('.training-text');
  if (intro) {
    const p = document.createElement('p');
    p.textContent = intro.textContent.trim();
    fragment.appendChild(p);
  }

  // --- Carousel Training block table ---
  const slides = element.querySelectorAll('.training-slide');
  const cells = [];

  slides.forEach((slide) => {
    // === Column 1: Slide card content (no images, no nav icons) ===
    const slideCell = [];

    // Count + Title as h3
    const counter = slide.querySelector('.training-slide-header-count');
    const title = slide.querySelector('.training-slide-header-title') ||
      slide.querySelector('h3');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = (counter ? counter.textContent.trim() + ' - ' : '') + title.textContent.trim();
      slideCell.push(h3);
    }

    // Subheader
    const subtitle = slide.querySelector('.training-slide-subheader');
    if (subtitle) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = subtitle.textContent.trim();
      p.appendChild(em);
      slideCell.push(p);
    }

    // Duration - use div textContent directly (Helix Importer strips <span> tags)
    const durationDiv = slide.querySelector('.training-slide-details-left');
    if (durationDiv) {
      const durationText = durationDiv.textContent.trim();
      if (durationText) {
        const p = document.createElement('p');
        p.textContent = durationText;
        slideCell.push(p);
      }
    }

    // Location - use div textContent directly (Helix Importer strips <span> tags)
    const locationDiv = slide.querySelector('.training-slide-details-right');
    if (locationDiv) {
      const locationText = locationDiv.textContent.trim();
      if (locationText) {
        const p = document.createElement('p');
        p.textContent = locationText;
        slideCell.push(p);
      }
    }

    // Description text (exclude "Read more" button)
    const text = slide.querySelector('.training-slide-opened');
    if (text) {
      const cloned = text.cloneNode(true);
      const readMoreClone = cloned.querySelector('.training-slide-readmore');
      if (readMoreClone) readMoreClone.remove();
      const trimmed = cloned.textContent.trim();
      if (trimmed) {
        const p = document.createElement('p');
        p.textContent = trimmed;
        slideCell.push(p);
      }
    }

    // === Column 2: More-details content (image, title, paragraph) ===
    const detailsCell = [];
    const moreDetails = slide.querySelector('.training-slide-moredetails');
    if (moreDetails) {
      const detailImg = moreDetails.querySelector('.training-slide-moredetails-image');
      if (detailImg && detailImg.src) {
        const img = document.createElement('img');
        img.src = detailImg.src;
        detailsCell.push(img);
      }

      const detailTitle = moreDetails.querySelector('.training-slide-moredetails-title');
      if (detailTitle) {
        const h4 = document.createElement('h4');
        h4.textContent = detailTitle.textContent.trim();
        detailsCell.push(h4);
      }

      const detailRight = moreDetails.querySelector('.training-slide-moredetails-right');
      if (detailRight) {
        const detailPara = detailRight.querySelector('p');
        if (detailPara) {
          const p = document.createElement('p');
          p.textContent = detailPara.textContent.trim();
          detailsCell.push(p);
        }
      }
    }

    cells.push([slideCell, detailsCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel Training', cells });
  fragment.appendChild(block);

  // --- Section Metadata ---
  const sectionMetadataCells = [
    ['style', 'dark'],
  ];
  const sectionMetadata = WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells: sectionMetadataCells,
  });
  fragment.appendChild(sectionMetadata);

  // Replace original element with the full section content
  element.replaceWith(fragment);
}
