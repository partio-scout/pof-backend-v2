"use strict";

/**
 * change-tracker.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
  /**
   * Check if there's any content-changes that need to be set as published
   */
  checkForChanges: async () => {
    const contentChanges = strapi.query("content-change", "change-tracker");
    
    const changes = await contentChanges.find();

    // Delete changes older than a month
    const monthAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 31);

    const changesToBeDeleted = changes.filter(
      (x) => x.deployed_at && new Date(x.deployed_at) < monthAgo
    );

    for (const change of changesToBeDeleted) {
      await contentChanges.delete({ id: change.id });
    }
    console.log(
      `Change tracker: Deleting over a month old changes. Deleted ${changesToBeDeleted.length} entries.`
    );

    // Look for changes that need updating
    let deployWorkflow;
    try {
      deployWorkflow = (
        await strapi.query("workflow", "github-actions").find()
      ).find((x) => x.name === "Deploy site");
    } catch (error) {
      console.error("Change tracker: Model 'workflow' from plugin 'github-actions' was not found. You have to install plugin 'strapi-plugin-github-workflows' for this plugin to work.");
      return;
    }

    if (!deployWorkflow) {
      console.error('Change tracker: Deploy workflow not found. If you have created a deployment workflow already, ensure that it is named: "Deploy site". If you haven\' created one, crate one with the beforementioned name');
      return;
    }

    const lastDeploy = new Date(deployWorkflow.started_at);

    const changesThatNeedUpdating = changes.filter(
      (x) => !x.deployed_at && new Date(x.change_time) < lastDeploy
    );

    for (const change of changesThatNeedUpdating) {
      await contentChanges.update(
        { id: change.id },
        { deployed_at: lastDeploy }
      );
    }
    console.log(
      `Change-tracker: Checking for deployed content. Last deploy at: ${deployWorkflow.started_at}. Updated ${changesThatNeedUpdating.length} entries.`
    );
  },
};
