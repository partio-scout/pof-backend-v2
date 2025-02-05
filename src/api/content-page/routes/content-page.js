'use strict';

/**
 * content-page router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::content-page.content-page', {
    config: {
      find: {
        middlewares: ["api::content-page.response-transform"],
      },
    },
  });