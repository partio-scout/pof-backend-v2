'use strict';

/**
 * activity router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::activity.activity', {
    config: {
      find: {
        middlewares: ["api::activity.response-transform"],
      },
    },
  });