'use strict';

/**
 * content-page controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::content-page.content-page', ({ strapi }) => ({
    // Override the default 'find' method
    async find(ctx) {
      // Call the default core find method
      const { data, meta } = await super.find(ctx);
  
      // Transform the content field into data
      const transformedData = data.map(item => ({
        ...item,
        attributes: {
          ...item.attributes,
          data: '', // map content to data
          main_text: { data: item.attributes.main_text }, // add main_text to data
        },
      }));
  
      // Return the modified data and the original meta
      return { data: transformedData, meta };
    },
  }));