"use strict";
const axios = require('axios');

/**
 * deploy-site.js controller
 *
 * @description: A set of functions called "actions" of the `deploy-site` plugin.
 */

module.exports = {
  index: async (ctx) => {
    const [settings] = await strapi
      .query("deploy-site-settings", "deploy-site")
      .find();

    ctx.send({
      settings,
    });
  },
  set: async (ctx) => {
    const settings = ctx.request.body;

    if (!settings.deploy_webhook_url || !settings.preview_url) {
      ctx.send({
        message: "no settings in body",
      });
      return;
    }

    const [existingSettings] = await strapi
      .query("deploy-site-settings", "deploy-site")
      .find();

    let entry;
    if (existingSettings) {
      entry = await strapi
        .query("deploy-site-settings", "deploy-site")
        .update({ id: existingSettings.id }, { ...settings });
    } else {
      entry = await strapi
        .query("deploy-site-settings", "deploy-site")
        .create({ ...settings });
    }

    ctx.send({
      message: "ok",
      settings: {
        deploy_webhook_url: entry.deploy_webhook_url,
        preview_url: entry.preview_url,
      },
    });
  },
  changes: async (ctx) => {
    const changes = await strapi
      .query("content-change", "deploy-site")
      .find({ _limit: -1 });

    const notPublishedChanges = changes.filter((change) => !change.deployed_at)

    // Send 200 `ok`
    ctx.send({
      changes: notPublishedChanges,
    });
  },
  deploy: async (ctx) => {
    const [settings] = await strapi
      .query("deploy-site-settings", "deploy-site")
      .find();

    if (!settings.deploy_webhook_url) {
      ctx.send({
        status: 500,
        message: "deploy_webhook_url is not set",
      });
      return;
    }

    await axios.post(settings.deploy_webhook_url);

    console.log('deploy-site: Site deployment started');

    await strapi.plugins["deploy-site"].services['deploy-site'].setChangesAsDeployed();

    ctx.send({
      message: 'ok',
    })
  }
};
