/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for RAF Recruitment website cleanup
 * Purpose: Remove non-content elements and fix HTML issues
 * Applies to: recruitment.raf.mod.uk (all templates)
 * Tested: /, /roles/roles-finder/aircrew/weapon-systems-officer/
 * Generated: 2026-02-19
 * Updated: 2026-03-06 - Added cleanup for roles-finder page elements:
 *   roletype toggle, favourite buttons, bookmark icons, Owl Carousel navigation,
 *   accordion chevrons, in-page nav links, and additional data attributes
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow of https://recruitment.raf.mod.uk/
 * - Captured DOM during migration workflow of https://recruitment.raf.mod.uk/roles/roles-finder/aircrew/weapon-systems-officer/
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

    // Remove arrow and chevron icons from CTA links and accordions (decorative SVGs)
    // EXTRACTED: right-arrow-blue/white.svg from CTA links, chevron-down-blue/white.svg from accordions,
    // left-arrow-blue.svg from carousel nav, livechat.svg from chat widget, bookmark-icon.svg from favourites
    const decorativeImgs = element.querySelectorAll(
      'img[src*="right-arrow"], img[src*="left-arrow"], img[src*="chevron-right"], img[src*="chevron-down"], img[src*="bookmark-icon"], img[src*="livechat.svg"]',
    );
    decorativeImgs.forEach((img) => img.remove());

    // Remove play button overlay images from video sections
    // EXTRACTED: Found <img class="videosingle-playbutton-image" src="/img/play-button-15.svg"> in captured DOM
    WebImporter.DOMUtils.remove(element, ['.videosingle-playbutton', '.videosingle-playbutton-image']);

    // Remove Cloudflare video iframe (background hero video)
    // EXTRACTED: Found <iframe id="CloudflarePlayer" src="https://iframe.videodelivery.net/..."> in captured DOM
    WebImporter.DOMUtils.remove(element, ['#CloudflarePlayer', '.cloudflare-player']);

    // Remove livechat widget elements (injected by JS on the source site)
    // EXTRACTED: Found livechat overlay containers in banner section
    WebImporter.DOMUtils.remove(element, ['.livechat-container', '.chat-widget', '#livechat-widget']);

    // Remove cookie consent banners and modal overlays
    WebImporter.DOMUtils.remove(element, ['.cookie-banner', '.cookie-consent', '#cookie-notice']);

    // --- Roles-finder specific cleanup ---

    // Remove Regular/Reserve toggle (hidden interactive UI element)
    // EXTRACTED: Found <div class="roletype-toggle-container hide"> in role detail pages
    WebImporter.DOMUtils.remove(element, ['.roletype-toggle-container']);

    // Remove favourite buttons and bookmark functionality (JS-driven, not migrated)
    // EXTRACTED: Found <button class="favourite-button"> in roleinfo and carousel30 sections
    WebImporter.DOMUtils.remove(element, ['.favourite-button']);

    // Remove in-page anchor navigation links (JS scroll behavior, not real content)
    // EXTRACTED: Found <div class="roleinfo-intro-body inpagelinks"> with anchor links
    WebImporter.DOMUtils.remove(element, ['.inpagelinks']);

    // Remove decorative dot indicator next to recruiting status text
    // EXTRACTED: Found <div class="roleinfo-isopentext-dot"></div> in role info section
    WebImporter.DOMUtils.remove(element, ['.roleinfo-isopentext-dot']);

    // Remove "Already applied?" section (favourites management, not migrated)
    // EXTRACTED: Found <div class="roleinfo-alreadyapplied"> with favourites links
    WebImporter.DOMUtils.remove(element, ['.roleinfo-alreadyapplied']);

    // Remove empty bonus text container
    // EXTRACTED: Found <div class="roleinfo-bonustext"> (empty) in role info section
    WebImporter.DOMUtils.remove(element, ['.roleinfo-bonustext']);

    // Remove Owl Carousel navigation controls (prev/next buttons, dots, custom nav)
    // EXTRACTED: Found .owl-nav, .owl-dots, .owl-nav-custom in training, application process, and similar roles carousels
    WebImporter.DOMUtils.remove(element, ['.owl-nav', '.owl-dots', '.owl-nav-custom']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining iframes and non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'script',
    ]);

    // Clean up data attributes used for JS behavior
    // EXTRACTED: Found data-forregular, data-forreserve, data-link, data-videoloopcount, data-screenreadertitle in captured DOM
    // Additional roles-finder attributes: data-addlabel, data-removelabel, data-value, data-anchor,
    // data-itemcount, data-totalslides, data-slideid
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('data-forregular');
      el.removeAttribute('data-forreserve');
      el.removeAttribute('data-link');
      el.removeAttribute('data-videoloopcount');
      el.removeAttribute('data-screenreadertitle');
      el.removeAttribute('data-livechat');
      el.removeAttribute('data-analytics');
      el.removeAttribute('data-addlabel');
      el.removeAttribute('data-removelabel');
      el.removeAttribute('data-value');
      el.removeAttribute('data-anchor');
      el.removeAttribute('data-itemcount');
      el.removeAttribute('data-totalslides');
      el.removeAttribute('data-slideid');
    });
  }
}
