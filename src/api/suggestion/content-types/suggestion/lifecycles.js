"use strict";
const { createLifecycleHooks } = require("../../../utils/algolia");
const { notifyAboutContent } = require("../../../utils/emailNotifications");

const contentType = "suggestion";

module.exports = {
  afterCreate(result, data) {
    if (result.from_web) {
      notifyAboutContent(result, "toteutusvinkki");
    }
  },
  async beforeUpdate(params, data) {
    // Set the suggestion's like_count based on the current likes
    data.like_count = data.likes?.length || 0;
  },
  ...createLifecycleHooks(contentType),
};
