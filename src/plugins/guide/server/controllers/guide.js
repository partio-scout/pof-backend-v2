"use strict";
const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "..", "content");

/**
 * guide.js controller
 *
 * @description: A set of functions called "actions" of the `guide` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  listGuides: async (ctx) => {
    // Add your own logic here.
    let guides = fs.readdirSync(contentDir);

    // Send 200 `ok`
    ctx.send({
      guides,
    });
  },
  getGuide: async (ctx) => {
    const id = ctx.params.id;

    const filePath = path.join(contentDir, id);

    const file = fs.readFileSync(filePath).toString("utf-8");

    ctx.send({
      content: file,
    });
  },
};
