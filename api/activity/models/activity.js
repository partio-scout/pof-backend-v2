"use strict";
const { createLifecycleHooks } = require("../../../utils/algolia");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const contentType = "activity";

module.exports = {
  lifecycles: {
    async beforeUpdate(params, data) {
      console.log('beforeUpdate', data);
      if (data.activity_groups?.length) {
        const activityGroups = await strapi.query('activity-group').find({ id_in: data.activity_groups });
        const ageGroupIds = activityGroups.map((x) => x.age_group?.id).filter(Boolean);
        data.age_groups = ageGroupIds
        console.log('Added age_groups:', ageGroupIds, 'to activity:', data.title);
      }
    },
    ...createLifecycleHooks(contentType),
  },

};
