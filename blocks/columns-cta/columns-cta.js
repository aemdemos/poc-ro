export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-cta-img-col');
        }
      }

      // Replace CTA text links with arrow icon
      const links = col.querySelectorAll('a[href]');
      links.forEach((link) => {
        // Skip links that wrap images
        if (link.querySelector('picture, img')) return;
        const linkParent = link.closest('p');
        if (linkParent) {
          link.setAttribute('aria-label', link.textContent.trim());
          link.classList.add('columns-cta-arrow');
          link.innerHTML = '<img src="/icons/cta-arrow.svg" alt="" loading="lazy">';
        }
      });
    });
  });
}
