'use strict';

/**
 * front-page router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::front-page.front-page', {
    config: {
      find: {
        middlewares: ["api::front-page.response-transform"],
      },
    },
  });