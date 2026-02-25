/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for RAF Recruitment website cleanup
 * Purpose: Remove non-content elements and fix HTML issues
 * Applies to: recruitment.raf.mod.uk (all templates)
 * Tested: /
 * Generated: 2026-02-19
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow of https://recruitment.raf.mod.uk/
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove hero scroll-to anchor element (empty div used for JS scrolling)
    // EXTRACTED: Found <div id="hero-scroll-to"></div> in captured DOM
    WebImporter.DOMUtils.remove(element, ['#hero-scroll-to']);

    // Remove video control buttons (play/pause for background video)
    // EXTRACTED: Found <div class="hero-video-controls"> in captured DOM
    WebImporter.DOMUtils.remove(element, ['.hero-video-controls']);

    // Remove arrow icons from CTA links (decorative SVG images)
    // EXTRACTED: Found <img src="/assets/img/right-arrow-blue.svg"> in captured DOM
    const arrowImgs = element.querySelectorAll('img[src*="right-arrow"], img[src*="chevron-right"], img[src*="livechat.svg"]');
    arrowImgs.forEach((img) => img.remove());

    // Remove play button overlay images from video sections
    // EXTRACTED: Found <img class="videosingle-playbutton-image" src="/img/play-button-15.svg"> in captured DOM
    WebImporter.DOMUtils.remove(element, ['.videosingle-playbutton', '.videosingle-playbutton-image']);

    // Remove Cloudflare video iframe (background hero video)
    // EXTRACTED: Found <iframe id="CloudflarePlayer" src="https://iframe.videodelivery.net/..."> in captured DOM
    WebImporter.DOMUtils.remove(element, ['#CloudflarePlayer', '.cloudflare-player']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining iframes and non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
    ]);

    // Clean up data attributes used for JS behavior
    // EXTRACTED: Found data-forregular, data-forreserve, data-link, data-videoloopcount, data-screenreadertitle in captured DOM
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('data-forregular');
      el.removeAttribute('data-forreserve');
      el.removeAttribute('data-link');
      el.removeAttribute('data-videoloopcount');
      el.removeAttribute('data-screenreadertitle');
    });
  }
}
