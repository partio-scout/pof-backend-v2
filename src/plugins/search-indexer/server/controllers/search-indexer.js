"use strict";

const pluginPgk = require("../../package.json");
const { updateInAlgolia } = require("../../../../../utils/algolia");

/**
 * search-indexer.js controller
 *
 * @description: A set of functions called "actions" of the `search-indexer` plugin.
 */

/**
 * The content types that need indexing
 */
const contentTypesToIndex = pluginPgk.indexableContent || [];

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    const contentToIndex =
      ctx.params.type === "all"
        ? contentTypesToIndex
        : contentTypesToIndex.includes(ctx.params.type)
        ? [ctx.params.type]
        : [];

    const result = {};

    for (const contentType of contentToIndex) {
      result[contentType] = await indexEntriesOfType(contentType);
    }

    ctx.send({
      result,
    });
  },
};

const indexEntriesOfType = async (contentType) => {
  const allEntries = [];

  const query = `api::${contentType}.${contentType}`;
  const entries = await strapi
    .query(query)
    .findMany({ populate: true, limit: 100, start: allEntries.length });
  allEntries.push(...entries);

  console.log("Found", allEntries.length, "of type", contentType, "to index");

  const results = [];
  for (const entry of allEntries) {
    await updateInAlgolia(contentType, entry);
    results.push(entry.title || entry.name || entry.id);
  }
  return results;
};
