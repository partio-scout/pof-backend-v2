"use strict";
const { createLifecycleHooks } = require("../../../utils/algolia");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const contentType = "activity-group";

module.exports = createLifecycleHooks(contentType);
