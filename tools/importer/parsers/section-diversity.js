/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Diversity & Inclusion section (no block table, free content only)
 *
 * Source: https://recruitment.raf.mod.uk/
 * Type: Section content (no EDS block - plain heading, paragraph, and link)
 *
 * Source HTML Pattern:
 * <div class="singlepanel-section">
 *   <div class="single-panel">
 *     <h2>DIVERSITY &amp; INCLUSION</h2>
 *     <div class="singlepanel-section-body-text">
 *       <p>Our differences make us stronger...</p>
 *     </div>
 *     <div><a href="/diversity-and-inclusion/">
 *       <img src="/assets/img/right-arrow-white.svg" alt="...">
 *     </a></div>
 *   </div>
 * </div>
 *
 * Output Structure (EDS markdown):
 * ## Diversity & Inclusion                          <-- free h2
 * <paragraph>                                       <-- free paragraph
 * [Diversity and Inclusion](url)                    <-- free link (rendered as icon via CSS)
 * Section Metadata: dark, diversity                 <-- section metadata table
 *
 * CSS Dependencies:
 * - Section style "dark" applies navy background, centered white text, button styling
 * - Section style "diversity" applies:
 *   - Italic rotated -11deg headings
 *   - CTA link rendered as 67px circle arrow icon via CSS background-image
 *     (font-size: 0 hides text, background: url('/icons/right-arrow-white.svg'))
 *   - Button hover: transparent background with opacity 0.8
 *
 * Icon: /icons/right-arrow-white.svg (67x67 white stroke circle with right chevron)
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  const fragment = document.createDocumentFragment();

  // --- Section heading (h2) ---
  // VALIDATED: Source has h2 inside .single-panel or directly in .singlepanel-section
  const heading = element.querySelector('.single-panel h2') ||
    element.querySelector('h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    fragment.appendChild(h2);
  }

  // --- Body text ---
  // VALIDATED: Source has .singlepanel-section-body-text containing paragraph(s)
  const bodyText = element.querySelector('.singlepanel-section-body-text') ||
    element.querySelector('.single-panel p');
  if (bodyText) {
    const p = document.createElement('p');
    // Get text content from the body text container (may have nested <p> tags)
    const innerP = bodyText.querySelector('p');
    p.textContent = (innerP || bodyText).textContent.trim();
    fragment.appendChild(p);
  }

  // --- CTA link ---
  // VALIDATED: Source has <a> wrapping an <img> (right-arrow-white.svg icon)
  // The link text is extracted from aria-label or derived from the href
  const ctaLink = element.querySelector('a[href*="diversity"]') ||
    element.querySelector('.single-panel a[href]:not([href="#"])');
  if (ctaLink) {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = ctaLink.href;
    // Use aria-label or fallback to meaningful text (CSS hides text and shows icon)
    link.textContent = ctaLink.getAttribute('aria-label') ||
      ctaLink.textContent.trim() ||
      'Diversity and Inclusion';
    p.appendChild(link);
    fragment.appendChild(p);
  }

  // --- Section Metadata ---
  const sectionMetadataCells = [
    ['style', 'dark, diversity'],
  ];
  const sectionMetadata = WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells: sectionMetadataCells,
  });
  fragment.appendChild(sectionMetadata);

  // Replace original element with the full section content
  element.replaceWith(fragment);
}
