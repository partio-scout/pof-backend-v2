'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Endpoint for liking suggestions.
   */
   async translations(ctx) {
    const { locale } = ctx.params;

    let settings = await strapi.services.settings.find({ _locale: locale });

    if (!settings) {
      ctx.response.status = 404;
      return;
    }

    return settings.translations;
  },
};
