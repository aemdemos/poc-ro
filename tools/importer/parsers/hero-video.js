/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-video block
 *
 * Source: https://recruitment.raf.mod.uk/
 * Base Block: hero
 *
 * Block Structure (from block library example):
 * - Row 1: Background image (optional)
 * - Row 2: Content (heading + body text)
 *
 * Source HTML Pattern:
 * <div class="hero-container">
 *   <h1 class="header-text animate-titles">
 *     <span class="top-header-text">FIND YOUR</span>
 *     <span class="bottom-header-text">FORCE</span>
 *   </h1>
 *   <div class="hero-media-container">...</div>
 *   <div class="hero-bottom-container">
 *     <div class="hero-text-container">body text</div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-19
 */
export default function parse(element, { document }) {
  // Extract heading text from split spans
  // VALIDATED: Source has h1.header-text with span.top-header-text and span.bottom-header-text
  const heading = element.querySelector('h1, h2.header-text, .header-text');

  // Extract body text
  // VALIDATED: Source has .hero-text-container or .hero-bottom-container
  const bodyText = element.querySelector('.hero-text-container') ||
    element.querySelector('.hero-bottom-container') ||
    element.querySelector('p');

  // Check for background image (some hero variants may have one)
  const bgImage = element.querySelector('img:not([src*="play-button"]):not([src*="arrow"])');

  // Build cells array matching hero block structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading + body text)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (bodyText) contentCell.push(bodyText);
  cells.push(contentCell);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero Video', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
