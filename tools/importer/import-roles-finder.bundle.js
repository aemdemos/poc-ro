var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-roles-finder.js
  var import_roles_finder_exports = {};
  __export(import_roles_finder_exports, {
    default: () => import_roles_finder_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const heading = element.querySelector("h1, h2.header-text, .header-text");
    const bgImage = element.querySelector(".hero-image") || element.querySelector(".hero-media-container img") || element.querySelector("img");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    if (heading) {
      cells.push([heading]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-roleinfo.js
  function parse2(element, { document }) {
    const col1 = [];
    const statusEl = element.querySelector(".roleinfo-isopentext-text");
    if (statusEl) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = statusEl.textContent.trim();
      p.appendChild(strong);
      col1.push(p);
    }
    const interestTags = element.querySelectorAll(".roleinfo-interests--interest");
    if (interestTags.length > 0) {
      const p = document.createElement("p");
      const tags = [];
      interestTags.forEach((tag) => {
        tags.push(tag.textContent.trim());
      });
      p.textContent = tags.join(", ");
      col1.push(p);
    }
    const payContainer = element.querySelector(".roleinfo-pay-container");
    if (payContainer) {
      const leftPay = payContainer.querySelector(".left");
      const rightPay = payContainer.querySelector(".right");
      if (leftPay) {
        const p = document.createElement("p");
        const label = leftPay.querySelector(".uppercase");
        const amount = leftPay.querySelector(".amount");
        p.textContent = `${label ? label.textContent.trim() : ""} ${amount ? amount.textContent.trim() : ""}`.trim();
        col1.push(p);
      }
      if (rightPay) {
        const p = document.createElement("p");
        const label = rightPay.querySelector(".uppercase");
        const amount = rightPay.querySelector(".amount");
        p.textContent = `${label ? label.textContent.trim() : ""} ${amount ? amount.textContent.trim() : ""}`.trim();
        col1.push(p);
      }
    }
    const highlights = element.querySelector(".roleinfo-highlights");
    if (highlights) {
      const paragraphs = highlights.querySelectorAll("p");
      paragraphs.forEach((para) => {
        const p = document.createElement("p");
        p.textContent = para.textContent.trim();
        col1.push(p);
      });
    }
    const applyLink = element.querySelector(".roleinfo-buttons a[href]");
    if (applyLink) {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = applyLink.href;
      link.textContent = applyLink.textContent.trim();
      p.appendChild(link);
      col1.push(p);
    }
    const col2 = [];
    const navHeading = element.querySelector(".roleinfo-intro-container h2");
    if (navHeading) {
      const h2 = document.createElement("h2");
      h2.textContent = navHeading.textContent.trim();
      col2.push(h2);
    }
    const navLinks = element.querySelectorAll(".roleinfo-intro-body a[href]");
    navLinks.forEach((navLink) => {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = navLink.href;
      link.textContent = navLink.textContent.trim();
      p.appendChild(link);
      col2.push(p);
    });
    const cells = [];
    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns Roleinfo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-dualpanel.js
  function extractRow(container) {
    const textSection = container.querySelector(".dualpanelblue-textsection");
    const heading = container.querySelector(".dualpanelblue-textsection-title") || container.querySelector("h3, h2");
    const bodyText = container.querySelector(".dualpanelblue-textsection-text");
    const image = container.querySelector(".dualpanelblue-image") || container.querySelector(".imagesection img") || container.querySelector("img");
    const textCell = [];
    if (heading) textCell.push(heading);
    if (bodyText) textCell.push(bodyText);
    const imageCell = image ? [image] : [];
    const textParent = textSection ? textSection.closest(".dualpanelblue-half") : null;
    const textOnRight = textParent && textParent.classList.contains("right");
    if (textOnRight) {
      return [imageCell, textCell];
    }
    return [textCell, imageCell];
  }
  function parse3(element, { document }) {
    if (element.dataset.consumed === "true") {
      element.remove();
      return;
    }
    const cells = [];
    cells.push(extractRow(element));
    let sibling = element.nextElementSibling;
    while (sibling && !sibling.classList.contains("dualpanelblue-container")) {
      sibling = sibling.nextElementSibling;
    }
    if (sibling && sibling.classList.contains("dualpanelblue-container")) {
      cells.push(extractRow(sibling));
      sibling.dataset.consumed = "true";
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion.js
  function parse4(element, { document }) {
    const fragment = document.createDocumentFragment();
    const heading = element.querySelector("h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      fragment.appendChild(h2);
    }
    const subheader = element.querySelector(".accordion-subheader") || element.querySelector(".accordion-container > p");
    if (subheader) {
      const p = document.createElement("p");
      p.textContent = subheader.textContent.trim();
      fragment.appendChild(p);
    }
    const accordionItems = element.querySelectorAll(".accordion-cell");
    const cells = [];
    accordionItems.forEach((item) => {
      const titleEl = item.querySelector(".accordion-cell-title h3") || item.querySelector(".accordion-cell-title");
      const label = document.createElement("p");
      label.textContent = titleEl ? titleEl.textContent.trim() : "";
      const bodyEl = item.querySelector(".accordion-cell-body");
      const body = bodyEl || document.createElement("p");
      cells.push([label, body]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Accordion", cells });
    fragment.appendChild(block);
    const sectionMetadataCells = [
      ["style", "light-blue"]
    ];
    const sectionMetadata = WebImporter.Blocks.createBlock(document, {
      name: "Section Metadata",
      cells: sectionMetadataCells
    });
    fragment.appendChild(sectionMetadata);
    element.replaceWith(fragment);
  }

  // tools/importer/parsers/carousel-training.js
  function parse5(element, { document }) {
    const fragment = document.createDocumentFragment();
    const heading = element.querySelector(".hero-container h2") || element.querySelector("h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      fragment.appendChild(h2);
    }
    const intro = element.querySelector(".training-text");
    if (intro) {
      const p = document.createElement("p");
      p.textContent = intro.textContent.trim();
      fragment.appendChild(p);
    }
    const slides = element.querySelectorAll(".training-slide");
    const cells = [];
    slides.forEach((slide) => {
      const slideCell = [];
      const counter = slide.querySelector(".training-slide-header-count");
      const title = slide.querySelector(".training-slide-header-title") || slide.querySelector("h3");
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = (counter ? counter.textContent.trim() + " - " : "") + title.textContent.trim();
        slideCell.push(h3);
      }
      const subtitle = slide.querySelector(".training-slide-subheader");
      if (subtitle) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = subtitle.textContent.trim();
        p.appendChild(em);
        slideCell.push(p);
      }
      const durationDiv = slide.querySelector(".training-slide-details-left");
      if (durationDiv) {
        const durationText = durationDiv.textContent.trim();
        if (durationText) {
          const p = document.createElement("p");
          p.textContent = durationText;
          slideCell.push(p);
        }
      }
      const locationDiv = slide.querySelector(".training-slide-details-right");
      if (locationDiv) {
        const locationText = locationDiv.textContent.trim();
        if (locationText) {
          const p = document.createElement("p");
          p.textContent = locationText;
          slideCell.push(p);
        }
      }
      const text = slide.querySelector(".training-slide-opened");
      if (text) {
        const cloned = text.cloneNode(true);
        const readMoreClone = cloned.querySelector(".training-slide-readmore");
        if (readMoreClone) readMoreClone.remove();
        const trimmed = cloned.textContent.trim();
        if (trimmed) {
          const p = document.createElement("p");
          p.textContent = trimmed;
          slideCell.push(p);
        }
      }
      const detailsCell = [];
      const moreDetails = slide.querySelector(".training-slide-moredetails");
      if (moreDetails) {
        const detailImg = moreDetails.querySelector(".training-slide-moredetails-image");
        if (detailImg && detailImg.src) {
          const img = document.createElement("img");
          img.src = detailImg.src;
          detailsCell.push(img);
        }
        const detailTitle = moreDetails.querySelector(".training-slide-moredetails-title");
        if (detailTitle) {
          const h4 = document.createElement("h4");
          h4.textContent = detailTitle.textContent.trim();
          detailsCell.push(h4);
        }
        const detailRight = moreDetails.querySelector(".training-slide-moredetails-right");
        if (detailRight) {
          const detailPara = detailRight.querySelector("p");
          if (detailPara) {
            const p = document.createElement("p");
            p.textContent = detailPara.textContent.trim();
            detailsCell.push(p);
          }
        }
      }
      cells.push([slideCell, detailsCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Carousel Training", cells });
    fragment.appendChild(block);
    const sectionMetadataCells = [
      ["style", "dark"]
    ];
    const sectionMetadata = WebImporter.Blocks.createBlock(document, {
      name: "Section Metadata",
      cells: sectionMetadataCells
    });
    fragment.appendChild(sectionMetadata);
    element.replaceWith(fragment);
  }

  // tools/importer/parsers/section-whyjoin-officer.js
  function parse6(element, { document }) {
    const fragment = document.createDocumentFragment();
    const heading = element.querySelector(".singlepanel-section-header-text") || element.querySelector("h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      fragment.appendChild(h2);
    }
    const bodyText = element.querySelector(".singlepanel-section-body-text");
    if (bodyText) {
      const innerP = bodyText.querySelector("p");
      const p = document.createElement("p");
      p.textContent = (innerP || bodyText).textContent.trim();
      fragment.appendChild(p);
    }
    const ctaLink = element.querySelector('a[href]:not([href="#"])');
    if (ctaLink) {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = ctaLink.href;
      link.textContent = ctaLink.getAttribute("aria-label") || ctaLink.textContent.trim() || "Discover more";
      p.appendChild(link);
      fragment.appendChild(p);
    }
    const sectionMetadataCells = [
      ["style", "dark"]
    ];
    const sectionMetadata = WebImporter.Blocks.createBlock(document, {
      name: "Section Metadata",
      cells: sectionMetadataCells
    });
    fragment.appendChild(sectionMetadata);
    element.replaceWith(fragment);
  }

  // tools/importer/parsers/cards-benefits.js
  function parse7(element, { document }) {
    const fragment = document.createDocumentFragment();
    const heading = element.querySelector(".benefits-header-text") || element.querySelector("h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      fragment.appendChild(h2);
    }
    const subtitleEl = element.querySelector(".benefits-text p") || element.querySelector(".benefits-text");
    if (subtitleEl) {
      const p = document.createElement("p");
      p.textContent = subtitleEl.textContent.trim();
      fragment.appendChild(p);
    }
    const benefitIcons = element.querySelectorAll(".benefits-icon");
    const cells = [];
    benefitIcons.forEach((icon) => {
      const iconImage = icon.querySelector("img");
      const imageCell = iconImage ? [iconImage] : [];
      const labelText = [];
      const textNodes = icon.childNodes;
      textNodes.forEach((node) => {
        if (node.nodeType === 1 && !node.classList.contains("benefits-icon-image-wrapper")) {
          const p = document.createElement("p");
          p.textContent = node.textContent.trim();
          if (p.textContent) labelText.push(p);
        }
      });
      cells.push([imageCell, labelText]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Cards Benefits", cells });
    fragment.appendChild(block);
    const ctaLink = element.querySelector(".benefits-button-container a[href]") || element.querySelector('a[href*="benefits"]');
    if (ctaLink) {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = ctaLink.href;
      link.textContent = ctaLink.getAttribute("aria-label") || ctaLink.textContent.trim();
      p.appendChild(link);
      fragment.appendChild(p);
    }
    const sectionMetadataCells = [
      ["style", "light-blue"]
    ];
    const sectionMetadata = WebImporter.Blocks.createBlock(document, {
      name: "Section Metadata",
      cells: sectionMetadataCells
    });
    fragment.appendChild(sectionMetadata);
    element.replaceWith(fragment);
  }

  // tools/importer/parsers/carousel-steps.js
  function parse8(element, { document }) {
    const fragment = document.createDocumentFragment();
    const heading = element.querySelector(".applicationprocess-hero-container h2") || element.querySelector("h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      fragment.appendChild(h2);
    }
    const intro = element.querySelector(".applicationprocess-text");
    if (intro) {
      const p = document.createElement("p");
      p.textContent = intro.textContent.trim();
      fragment.appendChild(p);
    }
    const slides = element.querySelectorAll(".applicationprocess-slide");
    const cells = [];
    slides.forEach((slide) => {
      const slideImage = slide.querySelector(".applicationprocess-slide-image");
      const imageCell = slideImage ? [slideImage] : [];
      const contentCell = [];
      const counter = slide.querySelector(".applicationprocess-slide-topper-counter");
      const title = slide.querySelector(".applicationprocess-slide-topper-text");
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = (counter ? counter.textContent.trim() + " - " : "") + title.textContent.trim();
        contentCell.push(h3);
      }
      const stage = slide.querySelector(".applicationprocess-slide-topper-stagetext");
      if (stage && stage.textContent.trim()) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = stage.textContent.trim();
        p.appendChild(em);
        contentCell.push(p);
      }
      const bodyText = slide.querySelector(".applicationprocess-slide-right-text");
      if (bodyText) {
        contentCell.push(bodyText);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Carousel Steps", cells });
    fragment.appendChild(block);
    const sectionMetadataCells = [
      ["style", "dark"]
    ];
    const sectionMetadata = WebImporter.Blocks.createBlock(document, {
      name: "Section Metadata",
      cells: sectionMetadataCells
    });
    fragment.appendChild(sectionMetadata);
    element.replaceWith(fragment);
  }

  // tools/importer/parsers/columns-cta.js
  function parse9(element, { document }) {
    const textPanel = element.querySelector(".panel-section-wrapper");
    const heading = element.querySelector(".panel-section-header-text") || element.querySelector("h3, h2");
    const bodyText = element.querySelector(".panel-section-body-text") || element.querySelector("p");
    const ctaLink = textPanel ? textPanel.querySelector('a[href]:not([href="#"])') || textPanel.querySelector("a[aria-label]") : element.querySelector('a[href]:not([href="#"])');
    const image = element.querySelector(".dual-panel-image") || element.querySelector(".dual-panel img");
    const imagePullLeft = element.querySelector(".pull-left");
    const textCell = [];
    if (heading) textCell.push(heading);
    if (bodyText) textCell.push(bodyText);
    if (ctaLink) {
      const cleanLink = document.createElement("a");
      cleanLink.href = ctaLink.href;
      cleanLink.textContent = ctaLink.getAttribute("aria-label") || ctaLink.textContent || "Learn More";
      textCell.push(cleanLink);
    }
    const imageCell = image ? [image] : [];
    const cells = [];
    if (imagePullLeft && imageCell.length > 0) {
      cells.push([imageCell, textCell]);
    } else {
      cells.push([textCell, imageCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns CTA", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-roles.js
  function parse10(element, { document }) {
    const fragment = document.createDocumentFragment();
    const heading = element.querySelector(".hero-container h2") || element.querySelector("h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      fragment.appendChild(h2);
    }
    const roleCards = element.querySelectorAll(".role-finder-result");
    const cells = [];
    roleCards.forEach((card) => {
      const imageCell = [];
      const bgStyle = card.getAttribute("style") || "";
      const bgMatch = bgStyle.match(/url\(['"]?([^'")\s]+)['"]?\)/);
      if (bgMatch) {
        const img = document.createElement("img");
        img.src = bgMatch[1];
        imageCell.push(img);
      }
      const contentCell = [];
      const category = card.querySelector(".role-finder-result--category");
      if (category && category.textContent.trim()) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = category.textContent.trim();
        p.appendChild(em);
        contentCell.push(p);
      }
      const title = card.querySelector(".role-finder-result--name");
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = title.textContent.trim();
        contentCell.push(h3);
      }
      const interestTags = card.querySelectorAll(".role-finder-result--interest");
      if (interestTags.length > 0) {
        const p = document.createElement("p");
        const tags = [];
        interestTags.forEach((tag) => {
          tags.push(tag.textContent.trim());
        });
        p.textContent = tags.join(", ");
        contentCell.push(p);
      }
      const roleLink = card.querySelector(".role-finder-result--link");
      if (roleLink) {
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.href = roleLink.href;
        link.textContent = roleLink.getAttribute("aria-label") || (title ? title.textContent.trim() : roleLink.textContent.trim());
        p.appendChild(link);
        contentCell.push(p);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Cards Roles", cells });
    fragment.appendChild(block);
    const ctaLink = element.querySelector(".carousel30-bottombutton") || element.querySelector('a[href*="roles-in-the-raf"]');
    if (ctaLink) {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = ctaLink.href;
      link.textContent = ctaLink.getAttribute("aria-label") || ctaLink.textContent.trim();
      p.appendChild(link);
      fragment.appendChild(p);
    }
    const sectionMetadataCells = [
      ["style", "light-blue"]
    ];
    const sectionMetadata = WebImporter.Blocks.createBlock(document, {
      name: "Section Metadata",
      cells: sectionMetadataCells
    });
    fragment.appendChild(sectionMetadata);
    element.replaceWith(fragment);
  }

  // tools/importer/parsers/section-contact.js
  function parse11(element, { document }) {
    const fragment = document.createDocumentFragment();
    const heading = element.querySelector("h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      fragment.appendChild(h2);
    }
    const bannerText = element.querySelector(".banner-text p") || element.querySelector(".banner-text") || element.querySelector("p");
    if (bannerText) {
      const p = document.createElement("p");
      p.textContent = bannerText.textContent.trim();
      fragment.appendChild(p);
    }
    const buttonContainer = element.querySelector(".banner-buttons") || element;
    const ctaLinks = buttonContainer.querySelectorAll("a[href]");
    ctaLinks.forEach((ctaLink) => {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = ctaLink.href;
      link.textContent = ctaLink.getAttribute("aria-label") || ctaLink.textContent.trim();
      p.appendChild(link);
      fragment.appendChild(p);
    });
    const sectionMetadataCells = [
      ["style", "dark"]
    ];
    const sectionMetadata = WebImporter.Blocks.createBlock(document, {
      name: "Section Metadata",
      cells: sectionMetadataCells
    });
    fragment.appendChild(sectionMetadata);
    element.replaceWith(fragment);
  }

  // tools/importer/transformers/raf-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["header"]);
      WebImporter.DOMUtils.remove(element, ["footer"]);
      WebImporter.DOMUtils.remove(element, ["#onetrust-consent-sdk", "#onetrust-pc-sdk", ".onetrust-pc-dark-filter"]);
      const trackingImgs = element.querySelectorAll('img[src*="t.co/i/adsct"], img[src*="analytics.twitter.com"]');
      trackingImgs.forEach((img) => img.remove());
      const trackingLinks = element.querySelectorAll('a[href*="t.co/i/adsct"], a[href*="analytics.twitter.com"]');
      trackingLinks.forEach((a) => a.remove());
      WebImporter.DOMUtils.remove(element, [".favourites-floating-button"]);
      WebImporter.DOMUtils.remove(element, ["#hero-scroll-to"]);
      WebImporter.DOMUtils.remove(element, [".hero-video-controls"]);
      const decorativeImgs = element.querySelectorAll(
        'img[src*="right-arrow"], img[src*="left-arrow"], img[src*="chevron-right"], img[src*="chevron-down"], img[src*="bookmark-icon"], img[src*="livechat.svg"]'
      );
      decorativeImgs.forEach((img) => img.remove());
      WebImporter.DOMUtils.remove(element, [".videosingle-playbutton", ".videosingle-playbutton-image"]);
      WebImporter.DOMUtils.remove(element, ["#CloudflarePlayer", ".cloudflare-player"]);
      WebImporter.DOMUtils.remove(element, [".livechat-container", ".chat-widget", "#livechat-widget"]);
      WebImporter.DOMUtils.remove(element, [".cookie-banner", ".cookie-consent", "#cookie-notice"]);
      WebImporter.DOMUtils.remove(element, [".roletype-toggle-container"]);
      WebImporter.DOMUtils.remove(element, [".favourite-button"]);
      WebImporter.DOMUtils.remove(element, [".roleinfo-isopentext-dot"]);
      WebImporter.DOMUtils.remove(element, [".roleinfo-alreadyapplied"]);
      WebImporter.DOMUtils.remove(element, [".roleinfo-bonustext"]);
      WebImporter.DOMUtils.remove(element, [".owl-nav", ".owl-dots", ".owl-nav-custom"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["canvas"]);
      const consumed = element.querySelectorAll('[data-consumed="true"]');
      consumed.forEach((el) => el.remove());
      const unwrapSelectors = ["#raf-app", "main", ".umb-block-list"];
      unwrapSelectors.forEach((sel) => {
        const wrapper = element.querySelector(sel);
        if (wrapper) {
          while (wrapper.firstChild) {
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
          }
          wrapper.remove();
        }
      });
      element.querySelectorAll("div").forEach((div) => {
        if (!div.className && !div.id && div.children.length === 0 && !div.textContent.trim()) {
          div.remove();
        }
      });
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript",
        "script"
      ]);
      const allElements = element.querySelectorAll("*");
      allElements.forEach((el) => {
        el.removeAttribute("data-forregular");
        el.removeAttribute("data-forreserve");
        el.removeAttribute("data-link");
        el.removeAttribute("data-videoloopcount");
        el.removeAttribute("data-screenreadertitle");
        el.removeAttribute("data-livechat");
        el.removeAttribute("data-analytics");
        el.removeAttribute("data-addlabel");
        el.removeAttribute("data-removelabel");
        el.removeAttribute("data-value");
        el.removeAttribute("data-anchor");
        el.removeAttribute("data-itemcount");
        el.removeAttribute("data-totalslides");
        el.removeAttribute("data-slideid");
      });
    }
  }

  // tools/importer/import-roles-finder.js
  var parsers = {
    "hero": parse,
    "columns-roleinfo": parse2,
    "columns": parse3,
    "accordion": parse4,
    "carousel-training": parse5,
    "section-whyjoin-officer": parse6,
    "cards-benefits": parse7,
    "carousel-steps": parse8,
    "columns-cta": parse9,
    "cards-roles": parse10,
    "section-contact": parse11
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "roles-finder",
    description: "RAF role detail page with hero image, role info panel (salary, status, tags), dual-panel text+image sections, entry requirements accordion, training carousel, benefits grid, application process steps, apply CTA, similar roles cards, and contact banner",
    urls: [
      "https://recruitment.raf.mod.uk/roles/roles-finder/aircrew/weapon-systems-officer/"
    ],
    blocks: [
      {
        name: "hero",
        instances: [".hero-container"],
        notes: "Simple hero with H1 title and background image. No video, no body text."
      },
      {
        name: "columns-roleinfo",
        instances: [".roleinfo-outer"],
        notes: "Custom structured layout with recruiting status, interest tags, dual salary tiers (initial + after 3 years), role description, Apply CTA, and in-page navigation links."
      },
      {
        name: "columns",
        instances: [".dualpanelblue-container.topspacer"],
        notes: "Multi-row columns block. Parser auto-discovers sibling container for row 2."
      },
      {
        name: "accordion",
        section: "light-blue",
        instances: [".accordion-container"],
        notes: "Entry requirements with expandable panels. Light blue background."
      },
      {
        name: "carousel-training",
        section: "dark",
        instances: [".training-container"],
        notes: "Numbered training phase cards. Dark navy background."
      },
      {
        name: "section-whyjoin-officer",
        section: "dark",
        instances: [".singlepanel-section"],
        notes: "Default content section: H2 heading, paragraph, and CTA link. Dark navy background."
      },
      {
        name: "cards-benefits",
        section: "light-blue",
        instances: [".benefits-container"],
        notes: "Benefit icon+label cards. Light blue background."
      },
      {
        name: "carousel-steps",
        section: "dark",
        instances: [".applicationprocess-container"],
        notes: "Numbered application step cards. Dark background with background images."
      },
      {
        name: "columns-cta",
        instances: [".dual-panel-section"],
        notes: "Apply Now CTA section. Reuses existing columns-cta variant."
      },
      {
        name: "cards-roles",
        section: "light-blue",
        instances: [".carousel30"],
        notes: "Similar roles card carousel. Light blue background."
      },
      {
        name: "section-contact",
        section: "dark",
        instances: [".banner-container"],
        notes: "Dark banner with H2 heading and two CTA buttons."
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_roles_finder_default = {
    /**
     * Main transformation function using one input / multiple outputs pattern
     */
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_roles_finder_exports);
})();
