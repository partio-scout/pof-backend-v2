"use strict";
const {
  updateInAlgolia,
  deleteFromAlgolia,
} = require("../../../../../utils/algolia");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const contentType = "age-group";

const updateActivityGroupActivities = async (group, ageGroupId) => {
  const activityGroup = await strapi
    .query("activity-group")
    .findOne({ id: group.id });

  if (activityGroup.activities?.length) {
    for (const activity of activityGroup.activities) {
      if (activity.age_group !== ageGroupId) {
        console.log("Updating age-group", ageGroupId, "to", activity.title);
        await strapi.query("api::activity.activity").update(
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
  async afterUpdate(event) {
    const { result, params } = event;
    if (result.activity_groups?.length) {
      (async () => {
        for (const group of result.activity_groups) {
          await updateActivityGroupActivities(group, result.id);
        }
      })();
    }
    await strapi.plugins["deploy-site"].services[
      "deploy-site"
    ].handleContentChange("update", result);
    updateInAlgolia(contentType, result);
  },
  async afterCreate(event) {
    const { result, params } = event;

    await strapi.plugins["deploy-site"].services[
      "deploy-site"
    ].handleContentChange("create", result);
  },
  async afterDelete(event) {
    const { result, params } = event;
    // Logic to handle after delete.
    await strapi.plugins["deploy-site"].services[
      "deploy-site"
    ].handleContentChange("delete", result);

    deleteFromAlgolia(contentType, result.id);
  },
};
