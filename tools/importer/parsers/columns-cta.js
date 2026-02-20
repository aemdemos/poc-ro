/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-cta block
 *
 * Source: https://recruitment.raf.mod.uk/
 * Base Block: columns
 *
 * Block Structure (from block library example):
 * - Row 1: Column 1 content | Column 2 content
 *   (text+CTA in one column, image in the other)
 *
 * Source HTML Pattern:
 * <div class="panel-section dual-panel-section">
 *   <div class="dual-panel">
 *     <div class="panel-section-wrapper">
 *       <h3 class="panel-section-header-text">
 *         <span class="top-header-text">FIND YOUR ROLE</span>
 *         <span class="bottom-header-text">AS A REGULAR</span>
 *       </h3>
 *       <div class="panel-section-body-text">...</div>
 *       <div><a href="/find-your-role/" aria-label="Find Your Role">...</a></div>
 *     </div>
 *   </div>
 *   <div class="dual-panel pull-right|pull-left">
 *     <img class="dual-panel-image" src="..." alt="...">
 *   </div>
 * </div>
 *
 * Generated: 2026-02-19
 */
export default function parse(element, { document }) {
  // Extract text content panel
  // VALIDATED: Source has .panel-section-wrapper containing heading, text, and CTA
  const textPanel = element.querySelector('.panel-section-wrapper');

  // Extract heading
  // VALIDATED: Source has h3.panel-section-header-text with span children
  const heading = element.querySelector('.panel-section-header-text') ||
    element.querySelector('h3, h2');

  // Extract body text
  // VALIDATED: Source has .panel-section-body-text
  const bodyText = element.querySelector('.panel-section-body-text') ||
    element.querySelector('p');

  // Extract CTA link
  // VALIDATED: Source has <a> with aria-label inside .panel-section-wrapper
  const ctaLink = textPanel
    ? textPanel.querySelector('a[href]:not([href="#"])') ||
      textPanel.querySelector('a[aria-label]')
    : element.querySelector('a[href]:not([href="#"])');

  // Extract image
  // VALIDATED: Source has img.dual-panel-image in .dual-panel.pull-right or .dual-panel.pull-left
  const image = element.querySelector('.dual-panel-image') ||
    element.querySelector('.dual-panel img');

  // Determine column order based on pull direction
  // VALIDATED: Source uses .pull-left (image first) or .pull-right (image second)
  const imagePullLeft = element.querySelector('.pull-left');

  // Build text content cell
  const textCell = [];
  if (heading) textCell.push(heading);
  if (bodyText) textCell.push(bodyText);
  if (ctaLink) {
    // Create clean CTA link with visible text
    const cleanLink = document.createElement('a');
    cleanLink.href = ctaLink.href;
    cleanLink.textContent = ctaLink.getAttribute('aria-label') || ctaLink.textContent || 'Learn More';
    textCell.push(cleanLink);
  }

  // Build image cell
  const imageCell = image ? [image] : [];

  // Build cells array - column order depends on layout direction
  const cells = [];
  if (imagePullLeft && imageCell.length > 0) {
    // Image on left, text on right
    cells.push([imageCell, textCell]);
  } else {
    // Text on left, image on right (default)
    cells.push([textCell, imageCell]);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns CTA', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
