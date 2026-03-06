/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-roleinfo block (roles-finder template)
 *
 * Source: https://recruitment.raf.mod.uk/roles/...
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: Column 1 (status + interests + salary + description + apply link) | Column 2 (in-page nav)
 *
 * Source HTML Pattern:
 * <div class="roleinfo-outer">
 *   <div class="roleinfo-container">
 *     <div class="roleinfo-details-wrapper">
 *       <div class="roleinfo-details-container">
 *         <div class="roleinfo-isopentext"><div class="roleinfo-isopentext-text">CURRENTLY RECRUITING</div></div>
 *         <div class="roleinfo-interests"><span class="roleinfo-interests--interest">Aircraft</span>...</div>
 *         <div class="roleinfo-pay-container">
 *           <div class="left"><div class="uppercase">INITIAL ANNUAL PAY...</div><div class="amount">£34,600+</div></div>
 *           <div class="right"><div class="uppercase">PAY AFTER 3 YEARS...</div><div class="amount">£64,600+</div></div>
 *         </div>
 *         <div class="roleinfo-highlights"><p>description...</p></div>
 *         <div class="roleinfo-buttons"><a href="/apply/...">Apply as a Regular</a></div>
 *       </div>
 *     </div>
 *     <div class="roleinfo-intro-container">
 *       <h2>On this page:</h2>
 *       <div class="roleinfo-intro-body inpagelinks"><p><a href="#...">link</a></p>...</div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-03-06
 */
export default function parse(element, { document }) {
  // --- Column 1: Role details ---
  const col1 = [];

  // Status text (e.g. "CURRENTLY RECRUITING")
  // VALIDATED: Source has .roleinfo-isopentext-text
  const statusEl = element.querySelector('.roleinfo-isopentext-text');
  if (statusEl) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = statusEl.textContent.trim();
    p.appendChild(strong);
    col1.push(p);
  }

  // Interest tags as comma-separated list
  // VALIDATED: Source has .roleinfo-interests with span.roleinfo-interests--interest children
  const interestTags = element.querySelectorAll('.roleinfo-interests--interest');
  if (interestTags.length > 0) {
    const p = document.createElement('p');
    const tags = [];
    interestTags.forEach((tag) => {
      tags.push(tag.textContent.trim());
    });
    p.textContent = tags.join(', ');
    col1.push(p);
  }

  // Salary information
  // VALIDATED: Source has .roleinfo-pay-container with .left and .right divs
  const payContainer = element.querySelector('.roleinfo-pay-container');
  if (payContainer) {
    const leftPay = payContainer.querySelector('.left');
    const rightPay = payContainer.querySelector('.right');
    if (leftPay) {
      const p = document.createElement('p');
      const label = leftPay.querySelector('.uppercase');
      const amount = leftPay.querySelector('.amount');
      p.textContent = `${label ? label.textContent.trim() : ''} ${amount ? amount.textContent.trim() : ''}`.trim();
      col1.push(p);
    }
    if (rightPay) {
      const p = document.createElement('p');
      const label = rightPay.querySelector('.uppercase');
      const amount = rightPay.querySelector('.amount');
      p.textContent = `${label ? label.textContent.trim() : ''} ${amount ? amount.textContent.trim() : ''}`.trim();
      col1.push(p);
    }
  }

  // Description / highlights
  // VALIDATED: Source has .roleinfo-highlights containing paragraph(s)
  const highlights = element.querySelector('.roleinfo-highlights');
  if (highlights) {
    const paragraphs = highlights.querySelectorAll('p');
    paragraphs.forEach((para) => {
      const p = document.createElement('p');
      p.textContent = para.textContent.trim();
      col1.push(p);
    });
  }

  // Apply link
  // VALIDATED: Source has .roleinfo-buttons containing <a> CTA
  const applyLink = element.querySelector('.roleinfo-buttons a[href]');
  if (applyLink) {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = applyLink.href;
    link.textContent = applyLink.textContent.trim();
    p.appendChild(link);
    col1.push(p);
  }

  // --- Column 2: In-page navigation ---
  const col2 = [];

  // "On this page:" heading
  // VALIDATED: Source has h2 inside .roleinfo-intro-container
  const navHeading = element.querySelector('.roleinfo-intro-container h2');
  if (navHeading) {
    const h2 = document.createElement('h2');
    h2.textContent = navHeading.textContent.trim();
    col2.push(h2);
  }

  // In-page nav links
  // VALIDATED: Source has .roleinfo-intro-body.inpagelinks with <p><a> links
  const navLinks = element.querySelectorAll('.roleinfo-intro-body a[href]');
  navLinks.forEach((navLink) => {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = navLink.href;
    link.textContent = navLink.textContent.trim();
    p.appendChild(link);
    col2.push(p);
  });

  // Build cells array
  const cells = [];
  cells.push([col1, col2]);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns Roleinfo', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
