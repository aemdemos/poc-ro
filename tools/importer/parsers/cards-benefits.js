/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-benefits block (roles-finder template)
 *
 * Source: https://recruitment.raf.mod.uk/roles/...
 * Base Block: cards
 *
 * Block Structure:
 * - One row per benefit icon: icon image | label text
 *
 * Source HTML Pattern:
 * <div class="benefits-container">
 *   <h2 class="benefits-header-text">WHY JOIN THE RAF?</h2>
 *   <div class="benefits-text"><p>Thanks to...</p></div>
 *   <div class="benefits-icons-container">
 *     <div class="benefits-icon">
 *       <div class="benefits-icon-image-wrapper"><img src="..." alt="..."></div>
 *       <div>Rent from £75p/m</div>
 *     </div>
 *     ...
 *   </div>
 *   <div class="benefits-button-container"><a href="/career-and-benefits/">View all benefits</a></div>
 * </div>
 *
 * Output Structure (EDS markdown):
 * ## WHY JOIN THE RAF?                      <-- free h2
 * <subtitle paragraph>                      <-- free paragraph
 * [Cards Benefits block table]              <-- icon | label rows
 * [View all benefits](url)                  <-- free CTA link
 * Section Metadata: light-blue              <-- section metadata table
 *
 * Generated: 2026-03-06
 */
export default function parse(element, { document }) {
  const fragment = document.createDocumentFragment();

  // --- Section heading (h2) ---
  // VALIDATED: Source has h2.benefits-header-text
  const heading = element.querySelector('.benefits-header-text') ||
    element.querySelector('h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    fragment.appendChild(h2);
  }

  // --- Subtitle text ---
  // VALIDATED: Source has .benefits-text containing paragraph(s)
  const subtitleEl = element.querySelector('.benefits-text p') ||
    element.querySelector('.benefits-text');
  if (subtitleEl) {
    const p = document.createElement('p');
    p.textContent = subtitleEl.textContent.trim();
    fragment.appendChild(p);
  }

  // --- Cards Benefits block table ---
  // VALIDATED: Source has .benefits-icons-container with .benefits-icon children
  const benefitIcons = element.querySelectorAll('.benefits-icon');
  const cells = [];

  benefitIcons.forEach((icon) => {
    // Extract icon image
    const iconImage = icon.querySelector('img');
    const imageCell = iconImage ? [iconImage] : [];

    // Extract label text (div text after the image wrapper)
    const labelText = [];
    const textNodes = icon.childNodes;
    textNodes.forEach((node) => {
      if (node.nodeType === 1 && !node.classList.contains('benefits-icon-image-wrapper')) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        if (p.textContent) labelText.push(p);
      }
    });

    cells.push([imageCell, labelText]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards Benefits', cells });
  fragment.appendChild(block);

  // --- CTA link ---
  // VALIDATED: Source has .benefits-button-container with <a> link
  const ctaLink = element.querySelector('.benefits-button-container a[href]') ||
    element.querySelector('a[href*="benefits"]');
  if (ctaLink) {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = ctaLink.href;
    link.textContent = ctaLink.getAttribute('aria-label') || ctaLink.textContent.trim();
    p.appendChild(link);
    fragment.appendChild(p);
  }

  // --- Section Metadata ---
  const sectionMetadataCells = [
    ['style', 'light-blue'],
  ];
  const sectionMetadata = WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells: sectionMetadataCells,
  });
  fragment.appendChild(sectionMetadata);

  // Replace original element with the full section content
  element.replaceWith(fragment);
}
