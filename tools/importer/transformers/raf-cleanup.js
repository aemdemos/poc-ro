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
 * Updated: 2026-03-09 - Strip site header, footer, OneTrust cookie consent, and
 *   floating favourites button so only main content is imported
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
    // --- Site-wide structural removal (header, footer, cookie consent) ---

    // Remove site header/navigation (EDS uses its own nav from nav.html)
    // EXTRACTED: <header> wraps logo, hamburger menu, nav links, search, contact block
    WebImporter.DOMUtils.remove(element, ['header']);

    // Remove site footer (EDS uses its own footer from footer.html)
    // EXTRACTED: <footer> wraps nav link lists, social icons, copyright, sitemap links
    WebImporter.DOMUtils.remove(element, ['footer']);

    // Remove OneTrust cookie consent SDK (banner, preference center, overlays)
    // EXTRACTED: <div id="onetrust-consent-sdk"> wraps cookie banner dialog and preferences
    WebImporter.DOMUtils.remove(element, ['#onetrust-consent-sdk', '#onetrust-pc-sdk', '.onetrust-pc-dark-filter']);

    // Remove Twitter/X analytics tracking pixels (invisible 1x1 images)
    // EXTRACTED: <img src="https://t.co/i/adsct..."> and <img src="https://analytics.twitter.com/...">
    const trackingImgs = element.querySelectorAll('img[src*="t.co/i/adsct"], img[src*="analytics.twitter.com"]');
    trackingImgs.forEach((img) => img.remove());

    // Remove anchor tags wrapping tracking pixel URLs (t.co/i/adsct, analytics.twitter.com)
    // These sometimes appear as <a href="https://t.co/i/adsct?..."> wrapping <img> or text nodes
    const trackingLinks = element.querySelectorAll('a[href*="t.co/i/adsct"], a[href*="analytics.twitter.com"]');
    trackingLinks.forEach((a) => a.remove());

    // Remove floating favourites button (site-wide interactive widget)
    // EXTRACTED: <a class="favourites-floating-button"> at bottom of page
    WebImporter.DOMUtils.remove(element, ['.favourites-floating-button']);

    // --- Element-level cleanup ---

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

    // NOTE: .inpagelinks is preserved — the columns-roleinfo parser extracts
    // "On this page:" nav links from .roleinfo-intro-body.inpagelinks

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
    // --- Strip page-level wrapper elements ---
    // The original page wraps content in <canvas>, <div id="raf-app">, <main>,
    // <div>, <div class="umb-block-list">. These must be unwrapped so EDS
    // receives flat content (tables become div-based blocks via the server).

    // Remove canvas elements (FlashingLights animation)
    WebImporter.DOMUtils.remove(element, ['canvas']);

    // Remove elements marked as consumed by parsers but not cleaned up
    const consumed = element.querySelectorAll('[data-consumed="true"]');
    consumed.forEach((el) => el.remove());

    // Unwrap structural containers in order (outermost to innermost)
    const unwrapSelectors = ['#raf-app', 'main', '.umb-block-list'];
    unwrapSelectors.forEach((sel) => {
      const wrapper = element.querySelector(sel);
      if (wrapper) {
        while (wrapper.firstChild) {
          wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
        }
        wrapper.remove();
      }
    });

    // Remove anonymous empty divs left after unwrapping (no class, no id, no content)
    element.querySelectorAll('div').forEach((div) => {
      if (!div.className && !div.id && div.children.length === 0
        && !div.textContent.trim()) {
        div.remove();
      }
    });

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
