"use strict";
const { createLifecycleHooks } = require("../../../utils/algolia");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const contentType = "activity-group";

const hooks = createLifecycleHooks(contentType);

module.exports = {
  lifecycles: {
    async afterUpdate(result) {
      if (result.age_group && result.activities?.length) {
        (async () => {
          for (const activity of result.activities) {
            console.log(activity);
            await strapi.query("activity").update(
              { id: activity.id },
              {
                age_groups: [
                  ...(activity.age_groups?.map((x) => x.id) || []),
                  result.age_group.id,
                ],
              }
            );
          }
        })();
      }

      hooks.afterUpdate(result);
    },
    afterDelete: hooks.afterDelete,
  },
};
