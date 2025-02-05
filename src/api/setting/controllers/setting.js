"use strict";
/**
 * setting controller
 */
const { createCoreController } = require("@strapi/strapi").factories;
module.exports = createCoreController("api::setting.setting", ({ strapi }) => ({
  async translations(ctx) {
    const { locale } = ctx.request.params;
    let settings = await strapi.services.settings.find({ _locale: locale });
    if (!settings) {
      ctx.response.status = 404;
      return;
    }
    return settings.translations;
  },
}));
