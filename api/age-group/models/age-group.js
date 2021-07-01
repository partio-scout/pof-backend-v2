"use strict";
const { createLifecycleHooks } = require("../../../utils/algolia");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const contentType = "age-group";

const hooks = createLifecycleHooks(contentType);

const updateActivityGroupActivities = async (group, ageGroupId) => {
  const activityGroup = await strapi
    .query("activity-group")
    .findOne({ id: group.id });

  if (activityGroup.activity_groups?.length) {
    console.log(
      "Activity group",
      activityGroup.title,
      "has",
      activityGroup.activity_groups?.length,
      "activity groups"
    );
    for (const g of activityGroup.activity_groups) {
      await updateActivityGroupActivities(g, ageGroupId);
    }
  }

  if (activityGroup.activities?.length) {
    console.log(
      "Activity group",
      activityGroup.title,
      "has",
      activityGroup.activities?.length,
      "activities"
    );
    for (const activity of activityGroup.activities) {
      console.log("Updating age-group", ageGroupId, "to", activity.title);
      await strapi.query("activity").update(
        { id: activity.id },
        {
          age_group: ageGroupId,
        }
      );
    }
  }
};

module.exports = {
  lifecycles: {
    async afterUpdate(result) {
      if (result.activity_groups?.length) {
        (async () => {
          for (const group of result.activity_groups) {
            await updateActivityGroupActivities(group, result.id);
          }
        })();
      }

      hooks.afterUpdate(result);
    },
    afterDelete: hooks.afterDelete,
  },
};
