'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterCreate(result, data) {
      if (result.from_web) {
        // TODO: Send email to interested parties
        // console.log('Sending notification about new suggestion from web');
      }
    },
  },
};
