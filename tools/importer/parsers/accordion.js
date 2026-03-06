/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block (roles-finder template)
 *
 * Source: https://recruitment.raf.mod.uk/roles/...
 * Base Block: accordion
 *
 * Block Structure:
 * - One row per accordion item: label | body
 *
 * Source HTML Pattern:
 * <div class="accordion-container">
 *   <h2 class="panel-section-header-text accordion-header-container">
 *     <span class="top-header-text">ENTRY</span>
 *     <span class="bottom-header-text">REQUIREMENTS</span>
 *   </h2>
 *   <div class="accordion-subheader"><p>Must be between...</p></div>
 *   <div class="accordion-wrapper" role="region">
 *     <div class="accordion-cell">
 *       <div class="accordion-cell-title">
 *         <h3 class="accordion-cell-title-text">EDUCATION REQUIREMENTS</h3>
 *       </div>
 *       <div class="accordion-cell-body">
 *         <div class="accordion-cell-bodytext"><p>...</p></div>
 *       </div>
 *     </div>
 *     ...
 *   </div>
 * </div>
 *
 * Output Structure (EDS markdown):
 * ## Heading                                <-- free h2
 * <subheader paragraph>                     <-- free paragraph
 * [Accordion block table]                   <-- label | body rows
 * Section Metadata: light-blue              <-- section metadata table
 *
 * Generated: 2026-03-06
 */
export default function parse(element, { document }) {
  const fragment = document.createDocumentFragment();

  // --- Section heading (h2) ---
  // VALIDATED: Source has h2 directly in .accordion-container
  const heading = element.querySelector('h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    fragment.appendChild(h2);
  }

  // --- Subheader text ---
  // VALIDATED: Source has .accordion-subheader or introductory paragraph
  const subheader = element.querySelector('.accordion-subheader') ||
    element.querySelector('.accordion-container > p');
  if (subheader) {
    const p = document.createElement('p');
    p.textContent = subheader.textContent.trim();
    fragment.appendChild(p);
  }

  // --- Accordion block table ---
  // VALIDATED: Source has .accordion-wrapper containing .accordion-cell items
  const accordionItems = element.querySelectorAll('.accordion-cell');
  const cells = [];

  accordionItems.forEach((item) => {
    // Extract label from .accordion-cell-title h3
    const titleEl = item.querySelector('.accordion-cell-title h3') ||
      item.querySelector('.accordion-cell-title');
    const label = document.createElement('p');
    label.textContent = titleEl ? titleEl.textContent.trim() : '';

    // Extract body from .accordion-cell-body (preserve rich text)
    const bodyEl = item.querySelector('.accordion-cell-body');
    const body = bodyEl || document.createElement('p');

    cells.push([label, body]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion', cells });
  fragment.appendChild(block);

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
