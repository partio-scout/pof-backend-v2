'use strict';

/**
 * duration controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::duration.duration', ({ strapi }) => ({
  // Override the default 'find' method
  async find(ctx) {
    // Call the default core find method
    const { data, meta } = await super.find(ctx);

    // Transform the content field into data
    const transformedData = data.map(item => ({
      ...item,
      attributes: {
        ...item.attributes,
        data: item.attributes.content, // map content
        content: undefined, // optionally remove content
      },
    }));

    // Return the modified data and the original meta
    return { data: transformedData, meta };
  },
}));