/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-roles block (roles-finder template)
 *
 * Source: https://recruitment.raf.mod.uk/roles/...
 * Base Block: cards
 *
 * Block Structure:
 * - One row per role card: image (if available) | content (category + title + tags + link)
 *
 * Source HTML Pattern:
 * <div class="carousel30">
 *   <div class="hero-container">
 *     <h2 class="header-text">
 *       <span class="top-header-text">SIMILAR</span>
 *       <span class="bottom-header-text">ROLES</span>
 *     </h2>
 *   </div>
 *   <div class="carousel30-slides-wrapper">
 *     <div class="carousel30-slides owl-loaded">
 *       <div class="role-finder-result" style="background-image: url('/media/...')">
 *         <a href="/roles/..." class="role-finder-result--link">...</a>
 *         <div class="role-finder-result-details">
 *           <div class="role-finder-result--category">Aircrew</div>
 *           <div class="role-finder-result--name">Weapon Systems Operator</div>
 *           <div class="role-finder-result--interests">
 *             <span class="role-finder-result--interest">Aircraft</span>...
 *           </div>
 *         </div>
 *       </div>
 *     </div>
 *     <div class="owl-nav">
 *       <a href="/roles-in-the-raf/" class="carousel30-bottombutton">Roles in the RAF</a>
 *     </div>
 *   </div>
 * </div>
 *
 * Output Structure (EDS markdown):
 * ## Heading                                <-- free h2
 * [Cards Roles block table]                 <-- role card rows
 * [Roles in the RAF](url)                   <-- free CTA link
 * Section Metadata: light-blue              <-- section metadata table
 *
 * Generated: 2026-03-06
 */
export default function parse(element, { document }) {
  const fragment = document.createDocumentFragment();

  // --- Section heading (h2) ---
  // VALIDATED: Source has h2.header-text inside .hero-container within .carousel30
  const heading = element.querySelector('.hero-container h2') ||
    element.querySelector('h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    fragment.appendChild(h2);
  }

  // --- Cards Roles block table ---
  // VALIDATED: Source has role cards as .role-finder-result items
  const roleCards = element.querySelectorAll('.role-finder-result');
  const cells = [];

  roleCards.forEach((card) => {
    // Extract background image from inline style
    const imageCell = [];
    const bgStyle = card.getAttribute('style') || '';
    const bgMatch = bgStyle.match(/url\(['"]?([^'")\s]+)['"]?\)/);
    if (bgMatch) {
      const img = document.createElement('img');
      img.src = bgMatch[1];
      imageCell.push(img);
    }

    // Build content cell
    const contentCell = [];

    // Category text
    const category = card.querySelector('.role-finder-result--category');
    if (category && category.textContent.trim()) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = category.textContent.trim();
      p.appendChild(em);
      contentCell.push(p);
    }

    // Role title
    const title = card.querySelector('.role-finder-result--name');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      contentCell.push(h3);
    }

    // Interest tags as comma-separated paragraph
    const interestTags = card.querySelectorAll('.role-finder-result--interest');
    if (interestTags.length > 0) {
      const p = document.createElement('p');
      const tags = [];
      interestTags.forEach((tag) => {
        tags.push(tag.textContent.trim());
      });
      p.textContent = tags.join(', ');
      contentCell.push(p);
    }

    // Link to role page
    const roleLink = card.querySelector('.role-finder-result--link');
    if (roleLink) {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = roleLink.href;
      link.textContent = roleLink.getAttribute('aria-label') || (title ? title.textContent.trim() : roleLink.textContent.trim());
      p.appendChild(link);
      contentCell.push(p);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards Roles', cells });
  fragment.appendChild(block);

  // --- CTA link ---
  // VALIDATED: Source has a.carousel30-bottombutton with link to roles page
  const ctaLink = element.querySelector('.carousel30-bottombutton') ||
    element.querySelector('a[href*="roles-in-the-raf"]');
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
