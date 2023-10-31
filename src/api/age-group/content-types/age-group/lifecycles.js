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

  if (activityGroup.activities?.length) {
    for (const activity of activityGroup.activities) {
      if (activity.age_group !== ageGroupId) {
        console.log("Updating age-group", ageGroupId, "to", activity.title);
        await strapi.query("activity").update(
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
