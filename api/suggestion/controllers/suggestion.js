"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Endpoint for creating new suggestions. This saves the suggestions in draft state,
   * so that they can be later published by admins.
   */
  async new(ctx) {
    let entity, data, files;

    if (ctx.is("multipart")) {
      ({ data, files } = parseMultipartData(ctx));
    } else {
      data = ctx.request.body;
    }

    // Set published_at null so the entry will be created in draft state
    data.published_at = null;
    data.from_web = true;

    entity = await strapi.services.suggestion.create(
      data,
      files ? { files } : undefined
    );

    return sanitizeEntity(entity, { model: strapi.models.suggestion });
  },
};
