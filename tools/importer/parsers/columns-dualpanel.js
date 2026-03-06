/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block from dualpanelblue sections (roles-finder template)
 *
 * Source: https://recruitment.raf.mod.uk/roles/...
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: Column 1 content | Column 2 content
 *   (text content in one column, image in the other; order determined by left/right classes)
 *
 * Source HTML Pattern:
 * <div class="dualpanelblue-container topspacer">
 *   <div class="dualpanelblue-half left">
 *     <div class="dualpanelblue-textsection">
 *       <h3 class="dualpanelblue-textsection-title">What will you do?</h3>
 *       <div class="dualpanelblue-textsection-text"><p>...</p><ul>...</ul></div>
 *     </div>
 *   </div>
 *   <div class="dualpanelblue-half imagesection right">
 *     <img class="dualpanelblue-image" src="..." alt="">
 *   </div>
 * </div>
 *
 * Generated: 2026-03-06
 */
export default function parse(element, { document }) {
  // Extract text content
  // VALIDATED: Source has .dualpanelblue-textsection with title and text
  const textSection = element.querySelector('.dualpanelblue-textsection');

  // Extract heading
  // VALIDATED: Source has h3.dualpanelblue-textsection-title
  const heading = element.querySelector('.dualpanelblue-textsection-title') ||
    element.querySelector('h3, h2');

  // Extract body text with rich content (paragraphs, lists)
  // VALIDATED: Source has .dualpanelblue-textsection-text containing <p> and <ul> elements
  const bodyText = element.querySelector('.dualpanelblue-textsection-text');

  // Extract image
  // VALIDATED: Source has img.dualpanelblue-image in .dualpanelblue-half.imagesection
  const image = element.querySelector('.dualpanelblue-image') ||
    element.querySelector('.imagesection img') ||
    element.querySelector('img');

  // Build text content cell
  const textCell = [];
  if (heading) textCell.push(heading);
  if (bodyText) textCell.push(bodyText);

  // Build image cell
  const imageCell = image ? [image] : [];

  // Determine column order from left/right classes
  // VALIDATED: Source uses .dualpanelblue-half.left and .dualpanelblue-half.right
  // If the text section parent has class "right", text goes in column 2
  const textParent = textSection ? textSection.closest('.dualpanelblue-half') : null;
  const textOnRight = textParent && textParent.classList.contains('right');

  // Build cells array - column order depends on layout direction
  const cells = [];
  if (textOnRight) {
    // Image on left, text on right
    cells.push([imageCell, textCell]);
  } else {
    // Text on left, image on right (default)
    cells.push([textCell, imageCell]);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
