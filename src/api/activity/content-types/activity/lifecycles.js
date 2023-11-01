"use strict";
const { createLifecycleHooks } = require("../../../utils/algolia");
const { getAgeGroupIdForActivity } = require("../../../utils/content");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const contentType = "activity";

module.exports = {
  async beforeUpdate(event) {
    let { data, id } = event.params;
    // Check that `age_group` is defined, this indicates that the current data is from the updated locale.
    // This is because all other locales update as well, but they only have the common fields defined.
    if (data.activity_group) {
      // Set the age-group for this activity by getting it from the parent activity-groups
      data.age_group = await getAgeGroupIdForActivity(id);

      console.log(
        "Updated age-group",
        data.age_group,
        "for activity",
        data.title || data
      );
    }
  },
  ...createLifecycleHooks(contentType),
};
