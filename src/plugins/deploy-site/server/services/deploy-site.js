"use strict";

/**
 * deploy-site.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = ({ strapi }) => {
  return {
    /**
     * Check if there's any content-changes that need to be set as published
     */
    checkForOldChanges: async () => {
      const contentChanges = strapi.db.query(
        "plugin::deploy-site.content-change"
      );

      const changes = await contentChanges.findMany();

      // Delete changes older than a month
      const monthAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 31);

      const changesToBeDeleted = changes.filter(
        (x) => x.deployed_at && new Date(x.deployed_at) < monthAgo
      );

      for (const change of changesToBeDeleted) {
        await contentChanges.delete({ id: change.id });
      }
      console.log(
        `Deploy-site: Deleting over a month old changes. Deleted ${changesToBeDeleted.length} entries.`
      );
    },

    /**
     * Set all undeployed content as deployed
     */
    setChangesAsDeployed: async () => {
      const contentChanges = strapi.db.query(
        "plugin::deploy-site.content-change"
      );

      const changes = await contentChanges.findMany();

      const changesThatNeedUpdating = changes.filter((x) => !x.deployed_at);

      for (const change of changesThatNeedUpdating) {
        await contentChanges.update({
          where: { id: change.id },
          data: {
            id: change.id,
            deployed_at: new Date(),
          },
        });
      }
      console.log(
        `Deploy-site: Updated ${changesThatNeedUpdating.length} entries.`
      );
    },
    async handleContentChange(action, data) {
      // Logic to determine if a change should be recorded.
      const shouldRecord = true; /* some logic to determine if the change should be recorded */

      if (shouldRecord) {
        await strapi.db.query("plugin::deploy-site.content-change").create({
          data: {
            content_name: data.title || data.name || "",
            content_type: data.__contentType,
            content_id: data.id,
            change_type: action,
            change_time: new Date(),
            // Other fields as necessary...
          },
        });
      }
    },
  };
};
