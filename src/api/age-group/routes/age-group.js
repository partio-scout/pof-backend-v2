'use strict';

/**
 * age-group router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::age-group.age-group', {
    config: {
      find: {
        middlewares: ["api::age-group.response-transform"],
      },
    },
  });