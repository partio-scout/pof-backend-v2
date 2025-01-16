"use strict";

const { sanitize } = require('@strapi/utils');

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
        data = JSON.parse(ctx.request.body.data); // Assuming 'data' is a JSON string
        files = ctx.request.files; // Files are directly available as ctx.request.files
      } else {
      data = ctx.request.body;
    }

    // Set published_at null so the entry will be created in draft state
    data.published_at = null;
    data.from_web = true;

    entity = await strapi.db.query('api::suggestion.suggestion').create(
      data,
      files ? { files } : undefined
    );

    return await strapi.entityService.sanitizeOutput(entity, { model: strapi.models.suggestion });
  },
  /**
   * Endpoint for liking suggestions.
   */
  async like(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.request.body;

    let entity = await strapi.db.query('api::suggestion.suggestion').findOne({
        where: { id: id },
    });

    if (!entity) {
      ctx.response.status = 404;
      return;
    }

    const likes = entity.likes || [];
    if (likes?.includes(user)) {
      ctx.response.status = 400;
      ctx.response.body = "already liked";
      return;
    }

    const updatedLikes = [...likes, user];

    entity = await strapi.db.query('api::suggestion.suggestion').update({
      where: { id: id },
      data: { likes: updatedLikes },
    });

    const model = strapi.getModel('api::suggestion.suggestion')
    const sanitizeOutput = await sanitize.contentAPI.output(entity, model)

    return sanitizeOutput
  },
  /**
   * Endpoint for unliking suggestions.
   */
  async unlike(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.request.body;

    let entity = await strapi.db.query('api::suggestion.suggestion').findOne({
      where: { id: id },
    });

    if (!entity) {
      ctx.response.status = 404;
      return;
    }

    const index = entity.likes?.findIndex((x) => x === user);
    if (index === undefined || index < 0) {
      ctx.response.status = 400;
      ctx.response.body = "not liked";
      return;
    }

    const updatedLikes = entity.likes || [];
    updatedLikes.splice(index, 1);

    entity = await strapi.db.query('api::suggestion.suggestion').update({
      where: { id: id },
      data: { likes: updatedLikes },
    });

    const model = strapi.getModel('api::suggestion.suggestion')
    const sanitizeOutput = await sanitize.contentAPI.output(entity, model)

    return sanitizeOutput
  },
  /**
   * Endpoint for creating new comments. This saves the comments in draft state,
   * so that they can be later published by admins.
   */
  async comment(ctx) {
    const { id } = ctx.params;

    let data;

    // Check that the suggestion exists
    const suggestion = await strapi.db.query('api::suggestion.suggestion').findOne({ where: { id: id }, });

    if (!suggestion) {
      ctx.response.status = 404;
      return;
    }

    if (ctx.is("multipart")) {
        data = JSON.parse(ctx.request.body.data); // Assuming 'data' is a JSON string
      } else {
      data = ctx.request.body;
    }

    // Set published_at null so the entry will be created in draft state
    data.published_at = null;
    data.suggestion = id;

    await strapi.db.query('api::comment.comment').create(data);

    ctx.response.status = 200;
  },
};
