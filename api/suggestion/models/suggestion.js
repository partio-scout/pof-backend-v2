"use strict";
const { createLifecycleHooks } = require("../../../utils/algolia");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
const contentType = "suggestion";

module.exports = {
  lifecycles: {
    async beforeUpdate(params, data) {
      // Set the suggestion's like_count based on the current likes
      data.like_count = data.likes?.length || 0;
    },
    async afterCreate(result, data) {
      if (result.from_web) {
        // TODO: Send email to interested parties
        // console.log('Sending notification about new suggestion from web');
      }
    },
    ...createLifecycleHooks(contentType),
  },
};
