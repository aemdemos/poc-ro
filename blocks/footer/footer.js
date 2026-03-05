import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Rearrange footer nav items for desktop layout.
 * Mobile (DOM order): Col1=primary(4), Col2=secondary(7), Col3=roles(14)
 * Desktop: Col1=primary+last4 of col2, Col2=first3 of col2+first4 of col3, Col3=remaining roles
 */
function rearrangeForDesktop(navColumns) {
  const cols = navColumns.querySelectorAll('.footer-col');
  if (cols.length < 3) return;

  const col1Ul = cols[0].querySelector('ul');
  const col2Ul = cols[1].querySelector('ul');
  const col3Ul = cols[2].querySelector('ul');
  if (!col1Ul || !col2Ul || !col3Ul) return;

  const col2Items = [...col2Ul.querySelectorAll('li')];
  const col3Items = [...col3Ul.querySelectorAll('li')];

  // Move last 4 from col2 (RAF main website, Air Cadets, Events, Contact) → col1
  col2Items.slice(3).forEach((li) => col1Ul.append(li));

  // Move first 4 from col3 (Apprenticeships, Rejoiners, Reserves, Sponsorship) → col2
  col3Items.slice(0, 4).forEach((li) => col2Ul.append(li));
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');

  const sections = [...fragment.querySelectorAll(':scope .section')];

  // Group first 4 sections into navigation columns
  let navColumns;
  if (sections.length >= 4) {
    navColumns = document.createElement('div');
    navColumns.className = 'footer-nav';
    for (let i = 0; i < 4; i += 1) {
      const col = sections[i].querySelector('.default-content-wrapper');
      if (col) {
        const column = document.createElement('div');
        column.className = 'footer-col';
        if (i === 3) {
          // 4th column: separate badge and social icons into distinct containers
          const children = [...col.children];
          const badge = document.createElement('div');
          badge.className = 'footer-badge';
          const social = document.createElement('div');
          social.className = 'footer-social';
          children.forEach((child) => {
            const img = child.querySelector('img');
            if (img && child.querySelector('a')) {
              social.append(child);
            } else {
              badge.append(child);
            }
          });
          column.append(badge, social);
        } else {
          column.append(...col.children);
        }
        navColumns.append(column);
      }
    }
    footer.append(navColumns);
  }

  // Logo section (5th section)
  if (sections.length >= 5) {
    const logoSection = document.createElement('div');
    logoSection.className = 'footer-logo';
    const content = sections[4].querySelector('.default-content-wrapper');
    if (content) logoSection.append(...content.children);
    footer.append(logoSection);
  }

  // Bottom bar (6th section)
  if (sections.length >= 6) {
    const bottomBar = document.createElement('div');
    bottomBar.className = 'footer-bottom';
    const content = sections[5].querySelector('.default-content-wrapper');
    if (content) bottomBar.append(...content.children);
    footer.append(bottomBar);
  }

  // Rearrange nav items for desktop
  if (navColumns && window.matchMedia('(min-width: 900px)').matches) {
    rearrangeForDesktop(navColumns);
  }

  block.append(footer);
}
