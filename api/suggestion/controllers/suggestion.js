'use strict';
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Endpoint for creating new comments. This saves the comments in draft state,
   * so that they can be later published by admins.
   */
   async comment(ctx) {
    const { id } = ctx.params;

    let entity, data;

    if (ctx.is("multipart")) {
      ({ data } = parseMultipartData(ctx));
    } else {
      data = ctx.request.body;
    }

    // Set published_at null so the entry will be created in draft state
    data.published_at = null;
    data.suggestion = id;

    entity = await strapi.services.comment.create(
      data,
    );

    ctx.response.status = 200;
  },
};
