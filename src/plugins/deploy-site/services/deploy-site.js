"use strict";

/**
 * deploy-site.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
  /**
   * Check if there's any content-changes that need to be set as published
   */
  checkForOldChanges: async () => {
    const contentChanges = strapi.query("content-change", "deploy-site");

    const changes = await contentChanges.find({ _limit: -1 });

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
    const contentChanges = strapi.query("content-change", "deploy-site");

    const changes = await contentChanges.find({ _limit: -1 });

    const changesThatNeedUpdating = changes.filter((x) => !x.deployed_at);

    for (const change of changesThatNeedUpdating) {
      await contentChanges.update(
        { id: change.id },
        { deployed_at: new Date() }
      );
    }
    console.log(
      `Deploy-site: Updated ${changesThatNeedUpdating.length} entries.`
    );
  },
};
