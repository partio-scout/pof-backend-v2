"use strict";

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

    console.log('entity', entity);
    if (!entity) {
      ctx.response.status = 404;
      return;
    }

    if (entity.like_count?.includes(user)) {
      ctx.response.status = 400;
      ctx.response.body = "already liked";
      return;
    }

    entity.like_count = [...(entity.like_count || []), user];

    entity = await strapi.db.query('api::suggestion.suggestion').update({ where: { id: id } }, entity);

    return await strapi.entityService.sanitizeOutput(entity, { model: strapi.models.suggestion });
  },
  /**
   * Endpoint for unliking suggestions.
   */
  async unlike(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.request.body;

    console.log('strapi', strapi);
    let entity = await strapi.db.query('api::suggestion.suggestion').findOne({ where: { id: id }, });

    if (!entity) {
      ctx.response.status = 404;
      return;
    }

    const index = entity.like?.findIndex((x) => x === user);

    if (index === undefined || index < 0) {
      ctx.response.status = 400;
      ctx.response.body = "not liked";
      return;
    }

    entity.likes.splice(index, 1);
    entity = await strapi.db.query('api::suggestion.suggestion').update({ where: { id: id }, }, entity);

    return await strapi.entityService.sanitizeOutput(entity, { model: strapi.models.suggestion });
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
