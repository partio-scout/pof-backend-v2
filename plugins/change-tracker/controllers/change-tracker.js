"use strict";

/**
 * change-tracker.js controller
 *
 * @description: A set of functions called "actions" of the `change-tracker` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */
  index: async (ctx) => {
    const { entry, event, model, created_at } = ctx.request.body;

    const newChange = {
      content_name: entry.title || entry.name || "",
      content_type: model,
      content_id: entry.id,
      change_type: event,
      change_time: created_at,
    };

    // If the change was not to a content-change or workflow entry, write it as a new content-change
    if (!["content-change", "workflow"].includes(newChange.content_type)) {
      await strapi.query("content-change", "change-tracker").create(newChange);
    }

    // Send 200 `ok`
    ctx.send({
      message: "ok",
    });
  },
};
