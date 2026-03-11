/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block from dualpanelblue sections (roles-finder template)
 *
 * Source: https://recruitment.raf.mod.uk/roles/...
 * Base Block: columns
 *
 * Block Structure (multi-row):
 * - Row 1: text left | image right  ("What will you do?" — topspacer)
 * - Row 2: image left | text right  ("Requirements at a glance" — bottomspacer)
 *
 * Source HTML Pattern:
 * <div class="dualpanelblue-container topspacer" id="whatwillyoudo-reg">
 *   <div class="dualpanelblue-half left">
 *     <div class="dualpanelblue-textsection">
 *       <h3>What will you do?</h3>
 *       <div class="dualpanelblue-textsection-text"><p>...</p><ul>...</ul></div>
 *     </div>
 *   </div>
 *   <div class="dualpanelblue-half imagesection right">
 *     <img class="dualpanelblue-image" src="..." alt="">
 *   </div>
 * </div>
 * <div class="dualpanelblue-container bottomspacer" id="requirements-reg">
 *   <div class="dualpanelblue-half imagesection left">
 *     <img class="dualpanelblue-image" src="..." alt="">
 *   </div>
 *   <div class="dualpanelblue-half right">
 *     <div class="dualpanelblue-textsection">
 *       <h3>Requirements at a glance</h3>
 *       <div class="dualpanelblue-textsection-text"><ul>...</ul></div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-03-06
 * Updated: 2026-03-09 - Combine topspacer + bottomspacer into a single multi-row block
 */

/**
 * Extract a row (textCell, imageCell) from a dualpanelblue-container element,
 * returning [col1, col2] in the correct left/right order.
 */
function extractRow(container) {
  const textSection = container.querySelector('.dualpanelblue-textsection');
  const heading = container.querySelector('.dualpanelblue-textsection-title') ||
    container.querySelector('h3, h2');
  const bodyText = container.querySelector('.dualpanelblue-textsection-text');
  const image = container.querySelector('.dualpanelblue-image') ||
    container.querySelector('.imagesection img') ||
    container.querySelector('img');

  const textCell = [];
  if (heading) textCell.push(heading);
  if (bodyText) textCell.push(bodyText);

  const imageCell = image ? [image] : [];

  const textParent = textSection ? textSection.closest('.dualpanelblue-half') : null;
  const textOnRight = textParent && textParent.classList.contains('right');

  if (textOnRight) {
    return [imageCell, textCell];
  }
  return [textCell, imageCell];
}

export default function parse(element, { document }) {
  // If this element was already consumed by a previous container, remove it
  if (element.dataset.consumed === 'true') {
    element.remove();
    return;
  }

  // Build cells starting with this element's row
  const cells = [];
  cells.push(extractRow(element));

  // Look for the next sibling dualpanelblue-container to combine as row 2
  // On some pages this has class "bottomspacer", on others it has no spacer class
  let sibling = element.nextElementSibling;
  while (sibling && !sibling.classList.contains('dualpanelblue-container')) {
    sibling = sibling.nextElementSibling;
  }
  if (sibling && sibling.classList.contains('dualpanelblue-container')) {
    cells.push(extractRow(sibling));
    // Mark sibling as consumed so it gets removed when its turn comes
    sibling.dataset.consumed = 'true';
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
