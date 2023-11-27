"use strict";

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */

module.exports = {
  // Check for old content-changes every hour
  checkForContentChanges: {
    task: async ({ strapi }) => {
      console.log("Checking for content changes and deploying them.");
      try {
        await strapi.plugins["deploy-site"].services[
          "deploy-site"
        ].checkForOldChanges();
      } catch (error) {
        console.log(`Deploying old content changes failed. Error: ${error}`);
      }
    },
    options: {
      rule: "1 * * * *",
    },
  },
};
