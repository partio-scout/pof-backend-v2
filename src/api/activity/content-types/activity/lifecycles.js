"use strict";
// const { createLifecycleHooks } = require("../../../utils/algolia");
const { getAgeGroupIdForActivity } = require("../../../../../utils/content");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

// const contentType = "activity";

module.exports = {
  async beforeUpdate(event) {
    let { result, params } = event;
    console.log(result, params);
    const data = params.data;
    // Check that `age_group` is defined, this indicates that the current data is from the updated locale.
    // This is because all other locales update as well, but they only have the common fields defined.
    if (data.activity_group) {
      console.log("lifecycles", data.id, data.activity_group);
      // Set the age-group for this activity by getting it from the parent activity-groups
      data.age_group = await getAgeGroupIdForActivity(data.id);

      console.log(
        "Updated age-group",
        data.age_group,
        "for activity",
        data.title || data
      );
    }
  },
  async afterCreate(event) {
    const { result, params } = event;

    console.log("RESULT", result);
    console.log("PARAMS", params);
    // Logic to handle after create.
    await strapi.plugins["deploy-site"].services[
      "deploy-site"
    ].handleContentChange("create", result);
  },
  async afterUpdate(event) {
    const { result, params } = event;
    // Logic to handle after update.
    await strapi.plugins["deploy-site"].services[
      "deploy-site"
    ].handleContentChange("update", result);
  },
  async afterDelete(event) {
    const { result, params } = event;
    // Logic to handle after delete.
    await strapi.plugins["deploy-site"].services[
      "deploy-site"
    ].handleContentChange("delete", result);
  },
  // ...createLifecycleHooks(contentType),
};
