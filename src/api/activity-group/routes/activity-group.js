'use strict';

/**
 * activity-group router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::activity-group.activity-group', {
    config: {
      find: {
        middlewares: ["api::activity-group.response-transform"],
      },
    },
  });