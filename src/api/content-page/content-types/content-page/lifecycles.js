"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const contentType = "content-page";

module.exports = {
  async afterCreate(event) {
    const { result, params } = event;
    // Logic to handle after create.
    await strapi.plugins["deploy-site"].services[
      "deploy-site"
    ].handleContentChange("create", contentType, result);
  },
  async afterUpdate(event) {
    const { result, params } = event;
    // Logic to handle after update.
    await strapi.plugins["deploy-site"].services[
      "deploy-site"
    ].handleContentChange("update", contentType, result);
  },
  async afterDelete(event) {
    const { result, params } = event;
    // Logic to handle after delete.
    await strapi.plugins["deploy-site"].services[
      "deploy-site"
    ].handleContentChange("delete", contentType, result);
  },
};
