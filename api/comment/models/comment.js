'use strict';
const { notifyAboutContent } = require('../../../utils/emailNotifications');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    afterCreate(result, data) {
      notifyAboutContent(result, 'kommentti');
    },
  },
};
