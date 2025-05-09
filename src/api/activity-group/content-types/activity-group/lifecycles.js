"use strict";
const {
  deleteFromAlgolia,
  updateInAlgolia,
} = require("../../../../../utils/algolia");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const contentType = "activity-group";

const updateActivityGroupActivities = async (activityGroup) => {
  if (activityGroup.activities?.length) {
    for (const activity of activityGroup.activities) {
      const ageGroupId = activityGroup.age_group?.id || null;
      if (activity.age_group !== ageGroupId) {
        console.log("Updating age-group", ageGroupId, "to", activity.title);
        await strapi.db.query("api::activity.activity").update(
          { id: activity.id },
          {
            age_group: ageGroupId,
          }
        );
      }
    }
  }
};

module.exports = {
  async afterCreate(event) {
    const { result, params } = event;
    // Logic to handle after create.
    await strapi.plugins["deploy-site"].services[
      "deploy-site"
    ].handleContentChange("create", contentType, result);

    updateInAlgolia(contentType, result);
  },
  async afterUpdate(event) {
    const { result, params } = event;
    updateActivityGroupActivities(result);

    await strapi.plugins["deploy-site"].services[
      "deploy-site"
    ].handleContentChange("update", contentType, result);

    updateInAlgolia(contentType, result);
  },
  async afterDelete(event) {
    const { result, params } = event;
    // Logic to handle after delete.
    await strapi.plugins["deploy-site"].services[
      "deploy-site"
    ].handleContentChange("delete", contentType, result);

    deleteFromAlgolia(contentType, result.id);
  },
};
