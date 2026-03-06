/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-steps block (roles-finder template)
 *
 * Source: https://recruitment.raf.mod.uk/roles/...
 * Base Block: carousel
 *
 * Block Structure:
 * - One row per application step: image | content (title + stage text + body text)
 *
 * Source HTML Pattern:
 * <div class="applicationprocess-container">
 *   <div class="applicationprocess-hero-container">
 *     <h2 class="header-text animate-titles-wish">
 *       <span class="top-header-text">WHAT HAPPENS</span>
 *       <span class="bottom-header-text">AFTER APPLYING</span>
 *     </h2>
 *   </div>
 *   <div class="applicationprocess-text">intro text</div>
 *   <div class="applicationprocess-slides owl-loaded">
 *     <div class="applicationprocess-slide">
 *       <div class="applicationprocess-slide-topper">
 *         <div class="applicationprocess-slide-topper-counter">1</div>
 *         <div class="applicationprocess-slide-topper-text-wrapper">
 *           <div class="applicationprocess-slide-topper-text">Aptitude test</div>
 *           <div class="applicationprocess-slide-topper-stagetext">Stage 1 of 7</div>
 *         </div>
 *       </div>
 *       <div class="applicationprocess-slide-right">
 *         <div class="applicationprocess-slide-right-text"><p>...</p><ul>...</ul></div>
 *       </div>
 *       <div class="applicationprocess-slide-left">
 *         <div class="applicationprocess-slide-left-wrapper">
 *           <div><img class="applicationprocess-slide-image" src="..." alt=""></div>
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
 * [Carousel Steps block table]                  <-- step rows
 * Section Metadata: dark                        <-- section metadata table
 *
 * Generated: 2026-03-06
 */
export default function parse(element, { document }) {
  const fragment = document.createDocumentFragment();

  // --- Section heading (h2) ---
  // VALIDATED: Source has h2.header-text inside .applicationprocess-hero-container
  const heading = element.querySelector('.applicationprocess-hero-container h2') ||
    element.querySelector('h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    fragment.appendChild(h2);
  }

  // --- Intro paragraph ---
  // VALIDATED: Source has .applicationprocess-text div with intro content
  const intro = element.querySelector('.applicationprocess-text');
  if (intro) {
    const p = document.createElement('p');
    p.textContent = intro.textContent.trim();
    fragment.appendChild(p);
  }

  // --- Carousel Steps block table ---
  // VALIDATED: Source has .applicationprocess-slides containing .applicationprocess-slide items
  const slides = element.querySelectorAll('.applicationprocess-slide');
  const cells = [];

  slides.forEach((slide) => {
    // Extract image from img.applicationprocess-slide-image
    const slideImage = slide.querySelector('.applicationprocess-slide-image');
    const imageCell = slideImage ? [slideImage] : [];

    // Build content cell
    const contentCell = [];

    // Counter from .applicationprocess-slide-topper-counter
    const counter = slide.querySelector('.applicationprocess-slide-topper-counter');

    // Title from .applicationprocess-slide-topper-text
    const title = slide.querySelector('.applicationprocess-slide-topper-text');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = (counter ? counter.textContent.trim() + ' - ' : '') + title.textContent.trim();
      contentCell.push(h3);
    }

    // Stage text from .applicationprocess-slide-topper-stagetext
    const stage = slide.querySelector('.applicationprocess-slide-topper-stagetext');
    if (stage && stage.textContent.trim()) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = stage.textContent.trim();
      p.appendChild(em);
      contentCell.push(p);
    }

    // Body text from .applicationprocess-slide-right-text (preserve rich text)
    const bodyText = slide.querySelector('.applicationprocess-slide-right-text');
    if (bodyText) {
      contentCell.push(bodyText);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel Steps', cells });
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
