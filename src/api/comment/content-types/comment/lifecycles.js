"use strict";
const {
  notifyAboutContent,
} = require("../../../../../utils/emailNotifications");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  afterCreate(event) {
    const { result, params } = event;
    notifyAboutContent(result, "kommentti", `${result.author}: ${result.text}`);
  },
};
