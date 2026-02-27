/* eslint-disable */
/* global WebImporter */

/**
 * Parser for "Have a Question?" contact section (no block table, free content only)
 *
 * Source: https://recruitment.raf.mod.uk/
 * Type: Section content (no EDS block - plain heading, paragraph, and CTA buttons)
 *
 * Source HTML Pattern:
 * <div class="banner-container">
 *   <h2>HAVE A QUESTION?</h2>
 *   <div class="banner-text">
 *     <p>Live chat is with a human not a bot</p>
 *   </div>
 *   <div class="banner-buttons">
 *     <a href="#" class="livechat-btn">Live Chat</a>
 *     <a href="/contact/">Contact Us</a>
 *   </div>
 * </div>
 *
 * Output Structure (EDS markdown):
 * ## Have a Question?                    <-- free h2
 * Live chat is with a human not a bot    <-- free paragraph
 * [Live Chat](#)                         <-- free link (auto-decorated as button by EDS)
 * [Contact Us](url)                      <-- free link (auto-decorated as button by EDS)
 * Section Metadata: dark                 <-- section metadata table
 *
 * CSS Dependencies:
 * - Section style "dark" in styles.css applies:
 *   - Navy background (--color-brand-primary), white text, centered layout
 *   - h2: italic, margin 0 0 48px
 *   - p: font-size 14px, line-height 22px, max-width 800px, centered
 *   - .button-container: display inline-block, margin 0 6px (side-by-side buttons)
 *   - a.button: white border, transparent background, pill shape
 *   - a.button:hover: white background, dark text
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  const fragment = document.createDocumentFragment();

  // --- Section heading (h2) ---
  // VALIDATED: Source has h2 directly in .banner-container
  const heading = element.querySelector('h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    fragment.appendChild(h2);
  }

  // --- Subtitle/description text ---
  // VALIDATED: Source has .banner-text or <p> with description
  const bannerText = element.querySelector('.banner-text p') ||
    element.querySelector('.banner-text') ||
    element.querySelector('p');
  if (bannerText) {
    const p = document.createElement('p');
    p.textContent = bannerText.textContent.trim();
    fragment.appendChild(p);
  }

  // --- CTA buttons ---
  // VALIDATED: Source has .banner-buttons containing multiple <a> links
  // EDS auto-decorates standalone <a> links as .button elements
  const buttonContainer = element.querySelector('.banner-buttons') || element;
  const ctaLinks = buttonContainer.querySelectorAll('a[href]');
  ctaLinks.forEach((ctaLink) => {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = ctaLink.href;
    link.textContent = ctaLink.getAttribute('aria-label') || ctaLink.textContent.trim();
    p.appendChild(link);
    fragment.appendChild(p);
  });

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
