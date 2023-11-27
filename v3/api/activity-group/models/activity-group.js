"use strict";
const { createLifecycleHooks } = require("../../../utils/algolia");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const contentType = "activity-group";

const hooks = createLifecycleHooks(contentType);

const updateActivityGroupActivities = async (activityGroup) => {
  if (activityGroup.activities?.length) {
    for (const activity of activityGroup.activities) {
      const ageGroupId = activityGroup.age_group?.id || null;
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
      updateActivityGroupActivities(result);

      hooks.afterUpdate(result);
    },
    afterDelete: hooks.afterDelete,
  },
};
