/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block (roles-finder template)
 *
 * Source: https://recruitment.raf.mod.uk/roles/...
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Background image
 * - Row 2: H1 heading
 *
 * Source HTML Pattern:
 * <div class="hero-container">
 *   <h1 class="header-text animate-titles">
 *     <span class="top-header-text">Weapon Systems</span>
 *     <span class="bottom-header-text">Officer</span>
 *   </h1>
 *   <div class="hero-media-container">
 *     <img class="hero-image" src="..." alt="...">
 *   </div>
 * </div>
 *
 * Generated: 2026-03-06
 */
export default function parse(element, { document }) {
  // Extract heading text from split spans
  // VALIDATED: Source has h1.header-text with span.top-header-text and span.bottom-header-text
  const heading = element.querySelector('h1, h2.header-text, .header-text');

  // Extract hero background image
  // VALIDATED: Source has img.hero-image inside .hero-media-container
  const bgImage = element.querySelector('.hero-image') ||
    element.querySelector('.hero-media-container img') ||
    element.querySelector('img');

  // Build cells array matching hero block structure
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: H1 heading
  if (heading) {
    cells.push([heading]);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
