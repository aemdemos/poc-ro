/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-featured block
 *
 * Source: https://recruitment.raf.mod.uk/
 * Base Block: embed
 *
 * Block Structure (from block library example):
 * - Row 1: Poster image (optional) + video URL
 *
 * Source HTML Pattern:
 * <div class="videosingle">
 *   <div class="hero-container"><h2>APPRENTICESHIPS IN THE RAF</h2></div>
 *   <div class="videosingle-image-container">
 *     <img class="videosingle-image" src="..." alt="...">
 *     <button data-link="https://www.youtube.com/embed/...">
 *   </div>
 *   <h3 class="videosingle-title">...</h3>
 *   <div class="videosingle-text">...</div>
 * </div>
 *
 * Generated: 2026-02-19
 */
export default function parse(element, { document }) {
  // Extract poster image
  // VALIDATED: Source has img.videosingle-image in .videosingle-image-container
  const posterImage = element.querySelector('.videosingle-image') ||
    element.querySelector('.videosingle-image-container img');

  // Extract YouTube video URL from the play button data attribute
  // VALIDATED: Source has button.videosingle-playbutton with data-link attribute
  const playButton = element.querySelector('.videosingle-playbutton, button[data-link]');
  let videoUrl = '';
  if (playButton) {
    const dataLink = playButton.getAttribute('data-link') || '';
    // Convert embed URL to standard YouTube watch URL
    const embedMatch = dataLink.match(/youtube\.com\/embed\/([^?]+)/);
    if (embedMatch) {
      videoUrl = `https://www.youtube.com/watch?v=${embedMatch[1]}`;
    } else {
      videoUrl = dataLink;
    }
  }

  // Build cells array matching embed block structure
  const cells = [];

  // Row 1: Poster image + video URL
  const contentCell = [];
  if (posterImage) contentCell.push(posterImage);
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    contentCell.push(link);
  }
  cells.push(contentCell);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Embed Featured', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
