/* eslint-disable */
/* global WebImporter */

/**
 * Parser for "Why Join as an Officer?" section (no block table, free content only)
 *
 * Source: https://recruitment.raf.mod.uk/roles/...
 * Type: Section content (no EDS block - plain heading, paragraph, and CTA link)
 *
 * Source HTML Pattern:
 * <div class="singlepanel-section">
 *   <h2 class="singlepanel-section-header-text">
 *     <span class="top-header-text">WHY JOIN AS</span>
 *     <span class="bottom-header-text">AN OFFICER?</span>
 *   </h2>
 *   <div class="singlepanel-section-body-text"><p>When you become...</p></div>
 *   <div><a href="/officer/" aria-label="Discover more">Discover more</a></div>
 * </div>
 *
 * Output Structure (EDS markdown):
 * ## WHY JOIN AS AN OFFICER?               <-- free h2
 * <paragraph>                               <-- free paragraph
 * [Discover more](url)                      <-- free link (auto-decorated as button by EDS)
 * Section Metadata: dark                    <-- section metadata table
 *
 * Generated: 2026-03-06
 */
export default function parse(element, { document }) {
  const fragment = document.createDocumentFragment();

  // --- Section heading (h2) ---
  // VALIDATED: Source has h2.singlepanel-section-header-text with span children
  const heading = element.querySelector('.singlepanel-section-header-text') ||
    element.querySelector('h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    fragment.appendChild(h2);
  }

  // --- Body text ---
  // VALIDATED: Source has .singlepanel-section-body-text containing paragraph(s)
  const bodyText = element.querySelector('.singlepanel-section-body-text');
  if (bodyText) {
    const innerP = bodyText.querySelector('p');
    const p = document.createElement('p');
    p.textContent = (innerP || bodyText).textContent.trim();
    fragment.appendChild(p);
  }

  // --- CTA link ---
  // VALIDATED: Source has <a> with href and aria-label inside .singlepanel-section
  const ctaLink = element.querySelector('a[href]:not([href="#"])');
  if (ctaLink) {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = ctaLink.href;
    link.textContent = ctaLink.getAttribute('aria-label') || ctaLink.textContent.trim() || 'Discover more';
    p.appendChild(link);
    fragment.appendChild(p);
  }

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
