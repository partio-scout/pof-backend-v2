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
  /**
   * Endpoint for liking suggestions.
   */
  async like(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.request.body;

    let entity = await strapi.services.suggestion.findOne({ id });

    if (!entity) {
      ctx.response.status = 404;
      return;
    }

    if (entity.likes?.includes(user)) {
      ctx.response.status = 400;
      ctx.response.body = 'already liked';
      return;
    }

    entity.likes = [...(entity.likes || []), user];

    entity = await strapi.services.suggestion.update({ id }, entity);

    return sanitizeEntity(entity, { model: strapi.models.suggestion });
  },
  /**
   * Endpoint for unliking suggestions.
   */
  async unlike(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.request.body;

    let entity = await strapi.services.suggestion.findOne({ id });

    if (!entity) {
      ctx.response.status = 404;
      return;
    }

    const index = entity.likes?.findIndex((x) => x === user);

    if (index < 0) {
      ctx.response.status = 400;
      ctx.response.body = 'not liked';
      return;
    }

    entity.likes.splice(index, 1);
    entity = await strapi.services.suggestion.update({ id }, entity);

    return sanitizeEntity(entity, { model: strapi.models.suggestion });
  },
  /**
   * Endpoint for creating new comments. This saves the comments in draft state,
   * so that they can be later published by admins.
   */
  async comment(ctx) {
    const { id } = ctx.params;

    let data;

    // Check that the suggestion exists
    const suggestion = await strapi.services.suggestion.findOne({ id });

    if (!suggestion) {
      ctx.response.status = 404;
      return;
    }

    if (ctx.is("multipart")) {
      ({ data } = parseMultipartData(ctx));
    } else {
      data = ctx.request.body;
    }

    // Set published_at null so the entry will be created in draft state
    data.published_at = null;
    data.suggestion = id;

    await strapi.services.comment.create(data);

    ctx.response.status = 200;
  },
};
