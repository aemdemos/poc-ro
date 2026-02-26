export default function decorate(block) {
  const rows = [...block.children];
  const imageRow = rows[0];
  const contentRow = rows[1];

  if (!contentRow) return;

  const contentCell = contentRow.querySelector(':scope > div');
  if (!contentCell) return;

  // Extract heading
  const heading = contentCell.querySelector('h1, h2, h3');

  // Find video link (Cloudflare videodelivery or similar)
  const videoLink = [...contentCell.querySelectorAll('a')].find((a) => {
    const href = a.href || '';
    return href.includes('videodelivery.net') || href.includes('cloudflarestream');
  });

  // Collect text paragraphs (not the video link paragraph)
  const textParagraphs = [...contentCell.querySelectorAll('p')].filter((p) => {
    if (p.querySelector('a[href*="videodelivery"], a[href*="cloudflarestream"]')) return false;
    return p.textContent.trim().length > 0;
  });

  // Clear block
  block.textContent = '';

  // Create media container
  const mediaContainer = document.createElement('div');
  mediaContainer.className = 'hero-video-media';

  // Add poster image
  const picture = imageRow.querySelector('picture');
  if (picture) {
    mediaContainer.appendChild(picture);
  }

  // Add video iframe
  if (videoLink) {
    const iframe = document.createElement('iframe');
    let src = videoLink.href;
    if (!src.includes('?')) {
      src += '?autoplay=true&muted=true&loop=true&controls=false';
    }
    iframe.src = src;
    iframe.className = 'hero-video-player';
    iframe.setAttribute('allow', 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('title', 'Hero background video');
    iframe.setAttribute('loading', 'eager');
    mediaContainer.appendChild(iframe);

    // Add play/pause controls
    const controls = document.createElement('div');
    controls.className = 'hero-video-controls';
    const pauseBtn = document.createElement('button');
    pauseBtn.setAttribute('aria-label', 'Play or pause background video');
    pauseBtn.textContent = '❚❚';
    let playing = true;
    pauseBtn.addEventListener('click', () => {
      if (playing) {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        pauseBtn.textContent = '▶';
      } else {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        pauseBtn.textContent = '❚❚';
      }
      playing = !playing;
    });
    controls.appendChild(pauseBtn);
    block.appendChild(controls);
  }

  block.appendChild(mediaContainer);

  // Add heading overlay
  if (heading) {
    heading.classList.add('hero-video-heading');
    block.appendChild(heading);
  }

  // Add bottom text container
  if (textParagraphs.length > 0) {
    const bottomContainer = document.createElement('div');
    bottomContainer.className = 'hero-video-text';
    textParagraphs.forEach((p) => bottomContainer.appendChild(p));
    block.appendChild(bottomContainer);
  }
}
