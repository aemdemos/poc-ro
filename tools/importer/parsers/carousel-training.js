/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-training block (roles-finder template)
 *
 * Source: https://recruitment.raf.mod.uk/roles/...
 * Base Block: carousel
 *
 * Block Structure:
 * - One row per training slide: image (if available) | content (title + description)
 *
 * Source HTML Pattern:
 * <div class="training-container">
 *   <div class="hero-container"><h2 class="header-text">...</h2></div>
 *   <div class="training-text">intro text</div>
 *   <div class="training-slides owl-loaded">
 *     <div class="training-slide">
 *       <div class="training-slide-wrapper">
 *         <div class="training-slide-header">
 *           <div class="training-slide-header-contents">
 *             <div class="training-slide-header-count">01</div>
 *             <h3 class="training-slide-header-title"><span>Phase one training</span></h3>
 *           </div>
 *         </div>
 *         <div class="training-slide-subheader">Initial Officer training</div>
 *         <div class="training-slide-details">
 *           <div class="training-slide-details-left"><img>24 weeks</div>
 *           <div class="training-slide-details-right"><img>RAF Cranwell</div>
 *         </div>
 *         <div class="training-slide-opened">description text</div>
 *       </div>
 *       <div class="training-slide-moredetails">
 *         <div class="training-slide-moredetails-left">
 *           <img class="training-slide-moredetails-image" src="...">
 *         </div>
 *         <div class="training-slide-moredetails-right">
 *           <h4>Phase one training</h4>
 *           <div><p>detailed description</p></div>
 *         </div>
 *       </div>
 *     </div>
 *     ...
 *   </div>
 * </div>
 *
 * Output Structure (EDS markdown):
 * ## Heading                                    <-- free h2
 * <intro paragraph>                             <-- free paragraph
 * [Carousel Training block table]               <-- slide rows
 * Section Metadata: dark                        <-- section metadata table
 *
 * Generated: 2026-03-06
 */
export default function parse(element, { document }) {
  const fragment = document.createDocumentFragment();

  // --- Section heading (h2) ---
  // VALIDATED: Source has h2.header-text inside .hero-container within .training-container
  const heading = element.querySelector('.hero-container h2') ||
    element.querySelector('h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    fragment.appendChild(h2);
  }

  // --- Intro paragraph ---
  // VALIDATED: Source has .training-text div with intro content
  const intro = element.querySelector('.training-text');
  if (intro) {
    const p = document.createElement('p');
    p.textContent = intro.textContent.trim();
    fragment.appendChild(p);
  }

  // --- Carousel Training block table ---
  // VALIDATED: Source has .training-slides containing .training-slide items
  const slides = element.querySelectorAll('.training-slide');
  const cells = [];

  slides.forEach((slide) => {
    // Extract image from .training-slide-moredetails-image
    const slideImage = slide.querySelector('.training-slide-moredetails-image');
    const imageCell = slideImage ? [slideImage] : [];

    // Build content cell
    const contentCell = [];

    // Slide counter from .training-slide-header-count
    const counter = slide.querySelector('.training-slide-header-count');

    // Slide title from h3.training-slide-header-title
    const title = slide.querySelector('.training-slide-header-title') ||
      slide.querySelector('h3');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = (counter ? counter.textContent.trim() + ' - ' : '') + title.textContent.trim();
      contentCell.push(h3);
    }

    // Subtitle from .training-slide-subheader
    const subtitle = slide.querySelector('.training-slide-subheader');
    if (subtitle) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = subtitle.textContent.trim();
      p.appendChild(em);
      contentCell.push(p);
    }

    // Duration metadata from .training-slide-details-left span
    const durationEl = slide.querySelector('.training-slide-details-left');
    if (durationEl) {
      const durationSpan = durationEl.querySelector('span');
      if (durationSpan && durationSpan.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = 'Duration: ' + durationSpan.textContent.trim();
        contentCell.push(p);
      }
    }

    // Location metadata from .training-slide-details-right span
    const locationEl = slide.querySelector('.training-slide-details-right');
    if (locationEl) {
      const locationSpan = locationEl.querySelector('span');
      if (locationSpan && locationSpan.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = 'Location: ' + locationSpan.textContent.trim();
        contentCell.push(p);
      }
    }

    // Description text from .training-slide-opened
    const text = slide.querySelector('.training-slide-opened');
    if (text) {
      const p = document.createElement('p');
      // Get text content but exclude the "Read more" button text
      const readMoreBtn = text.querySelector('.training-slide-readmore');
      const cloned = text.cloneNode(true);
      const readMoreClone = cloned.querySelector('.training-slide-readmore');
      if (readMoreClone) readMoreClone.remove();
      p.textContent = cloned.textContent.trim();
      contentCell.push(p);
    }

    cells.push([imageCell, contentCell]);
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
