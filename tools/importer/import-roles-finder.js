/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for roles-finder template
import heroParser from './parsers/hero.js';
import columnsRoleinfoParser from './parsers/columns-roleinfo.js';
import columnsDualpanelParser from './parsers/columns-dualpanel.js';
import accordionParser from './parsers/accordion.js';
import carouselTrainingParser from './parsers/carousel-training.js';
import sectionWhyjoinOfficerParser from './parsers/section-whyjoin-officer.js';
import cardsBenefitsParser from './parsers/cards-benefits.js';
import carouselStepsParser from './parsers/carousel-steps.js';
import columnsCtaParser from './parsers/columns-cta.js';
import cardsRolesParser from './parsers/cards-roles.js';
import sectionContactParser from './parsers/section-contact.js';

// TRANSFORMER IMPORTS
import rafCleanupTransformer from './transformers/raf-cleanup.js';

// PARSER REGISTRY - Map block names to parser functions
const parsers = {
  'hero': heroParser,
  'columns-roleinfo': columnsRoleinfoParser,
  'columns': columnsDualpanelParser,
  'accordion': accordionParser,
  'carousel-training': carouselTrainingParser,
  'section-whyjoin-officer': sectionWhyjoinOfficerParser,
  'cards-benefits': cardsBenefitsParser,
  'carousel-steps': carouselStepsParser,
  'columns-cta': columnsCtaParser,
  'cards-roles': cardsRolesParser,
  'section-contact': sectionContactParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  rafCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'roles-finder',
  description: 'RAF role detail page with hero image, role info panel (salary, status, tags), dual-panel text+image sections, entry requirements accordion, training carousel, benefits grid, application process steps, apply CTA, similar roles cards, and contact banner',
  urls: [
    'https://recruitment.raf.mod.uk/roles/roles-finder/aircrew/weapon-systems-officer/',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.hero-container'],
      notes: 'Simple hero with H1 title and background image. No video, no body text.',
    },
    {
      name: 'columns-roleinfo',
      instances: ['.roleinfo-outer'],
      notes: 'Custom structured layout with recruiting status, interest tags, dual salary tiers (initial + after 3 years), role description, Apply CTA, and in-page navigation links.',
    },
    {
      name: 'columns',
      instances: ['.dualpanelblue-container.topspacer', '.dualpanelblue-container.bottomspacer'],
      notes: 'Standard two-column text+image layouts.',
    },
    {
      name: 'accordion',
      section: 'light-blue',
      instances: ['.accordion-container'],
      notes: 'Entry requirements with expandable panels. Light blue background.',
    },
    {
      name: 'carousel-training',
      section: 'dark',
      instances: ['.training-container'],
      notes: 'Numbered training phase cards. Dark navy background.',
    },
    {
      name: 'section-whyjoin-officer',
      section: 'dark',
      instances: ['.singlepanel-section'],
      notes: 'Default content section: H2 heading, paragraph, and CTA link. Dark navy background.',
    },
    {
      name: 'cards-benefits',
      section: 'light-blue',
      instances: ['.benefits-container'],
      notes: 'Benefit icon+label cards. Light blue background.',
    },
    {
      name: 'carousel-steps',
      section: 'dark',
      instances: ['.applicationprocess-container'],
      notes: 'Numbered application step cards. Dark background with background images.',
    },
    {
      name: 'columns-cta',
      instances: ['.dual-panel-section'],
      notes: 'Apply Now CTA section. Reuses existing columns-cta variant.',
    },
    {
      name: 'cards-roles',
      section: 'light-blue',
      instances: ['.carousel30'],
      notes: 'Similar roles card carousel. Light blue background.',
    },
    {
      name: 'section-contact',
      section: 'dark',
      instances: ['.banner-container'],
      notes: 'Dark banner with H2 heading and two CTA buttons.',
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function using one input / multiple outputs pattern
   */
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
