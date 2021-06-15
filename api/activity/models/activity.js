"use strict";
const {
  deleteFromAlgolia,
  updateInAlgolia,
} = require("../../../utils/algolia");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const contentType = "activity";

module.exports = {
  lifecycles: {
    afterUpdate(result, params, data) {
      updateInAlgolia(contentType, result);
    },
    afterDelete(result, params) {
      deleteFromAlgolia(contentType, result.id);
    },
  },
};
