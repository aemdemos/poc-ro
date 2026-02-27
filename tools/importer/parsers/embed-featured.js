/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-featured block (Apprenticeships section)
 *
 * Source: https://recruitment.raf.mod.uk/
 * Base Block: embed
 *
 * Block Structure (from block library example):
 * - Row 1: Poster image (optional) + video URL
 *
 * Source HTML Pattern:
 * <div class="videosingle">
 *   <div class="hero-container"><h2>APPRENTICESHIPS IN THE RAF</h2></div>
 *   <div class="videosingle-image-container">
 *     <img class="videosingle-image" src="..." alt="...">
 *     <button data-link="https://www.youtube.com/embed/...">
 *   </div>
 *   <h3 class="videosingle-title">What makes a great RAF apprentice?</h3>
 *   <div class="videosingle-text">Hear from former apprentices...</div>
 * </div>
 *
 * Output Structure (EDS markdown):
 * ## Apprenticeships in the RAF          <-- free h2 above block
 * [Embed Featured block table]           <-- poster image + video URL
 * ### What makes a great RAF apprentice? <-- free h3 below block
 * <description paragraph>               <-- free paragraph
 * [View Apprenticeships page](url)       <-- free CTA link
 * Section Metadata: apprenticeships      <-- section metadata table
 *
 * CSS Dependencies:
 * - Section style "apprenticeships" in styles.css applies:
 *   - padding-top: 60px on section
 *   - h2: italic, rotated -11deg, centered, margin 140px 0 200px (balanced for rotation bounding box)
 *   - .embed-featured-wrapper: max-width unset, padding 0 (full-width video)
 *   - .embed-featured: max-width 1440px, margin 0 auto (centered for wide viewports)
 *   - h3: text-transform none, no rotation, no italic, 19px/700/29px line-height
 *   - CTA button: blue filled pill (--color-raf-cta-blue), centered, padding 120px 0 68px
 *
 * Generated: 2026-02-19
 * Updated: 2026-02-27 - Added surrounding section content extraction and section metadata
 */
export default function parse(element, { document }) {
  const fragment = document.createDocumentFragment();

  // --- Section heading (h2) ---
  // VALIDATED: Source has h2 inside .hero-container within .videosingle
  const sectionHeading = element.querySelector('.hero-container h2') ||
    element.querySelector('h2');
  if (sectionHeading) {
    const h2 = document.createElement('h2');
    h2.textContent = sectionHeading.textContent.trim();
    fragment.appendChild(h2);
  }

  // --- Embed Featured block table ---
  // Extract poster image
  // VALIDATED: Source has img.videosingle-image in .videosingle-image-container
  const posterImage = element.querySelector('.videosingle-image') ||
    element.querySelector('.videosingle-image-container img');

  // Extract YouTube video URL from the play button data attribute
  // VALIDATED: Source has button.videosingle-playbutton with data-link attribute
  const playButton = element.querySelector('.videosingle-playbutton, button[data-link]');
  let videoUrl = '';
  if (playButton) {
    const dataLink = playButton.getAttribute('data-link') || '';
    // Convert embed URL to standard YouTube watch URL
    const embedMatch = dataLink.match(/youtube\.com\/embed\/([^?]+)/);
    if (embedMatch) {
      videoUrl = `https://www.youtube.com/watch?v=${embedMatch[1]}`;
    } else {
      videoUrl = dataLink;
    }
  }

  // Build cells array matching embed block structure
  const cells = [];

  // Row 1: Poster image + video URL
  const contentCell = [];
  if (posterImage) contentCell.push(posterImage);
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    contentCell.push(link);
  }
  cells.push(contentCell);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Embed Featured', cells });
  fragment.appendChild(block);

  // --- Subtitle (h3) ---
  // VALIDATED: Source has h3.videosingle-title after the video container
  const subtitle = element.querySelector('.videosingle-title') ||
    element.querySelector('h3');
  if (subtitle) {
    const h3 = document.createElement('h3');
    h3.textContent = subtitle.textContent.trim();
    fragment.appendChild(h3);
  }

  // --- Description text ---
  // VALIDATED: Source has .videosingle-text containing description paragraph
  const descriptionEl = element.querySelector('.videosingle-text');
  if (descriptionEl) {
    const p = document.createElement('p');
    p.textContent = descriptionEl.textContent.trim();
    fragment.appendChild(p);
  }

  // --- CTA link ---
  // The "View Apprenticeships page" CTA may be in an adjacent sibling element
  // or within a wrapper. Check the next sibling for a link.
  const nextSibling = element.nextElementSibling;
  if (nextSibling) {
    const ctaLink = nextSibling.querySelector('a[href*="apprenticeships"]') ||
      nextSibling.querySelector('a[href]:not([href="#"])');
    if (ctaLink) {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.textContent = ctaLink.getAttribute('aria-label') || ctaLink.textContent.trim() || 'View Apprenticeships page';
      p.appendChild(link);
      fragment.appendChild(p);
    }
  }

  // --- Section Metadata ---
  const sectionMetadataCells = [
    ['style', 'apprenticeships'],
  ];
  const sectionMetadata = WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells: sectionMetadataCells,
  });
  fragment.appendChild(sectionMetadata);

  // Replace original element with the full section content
  element.replaceWith(fragment);
}
