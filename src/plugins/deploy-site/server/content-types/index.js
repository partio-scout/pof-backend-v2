"use strict";

const deploySiteSettings = require("./deploy-site-settings");
const contentChange = require("./content-change");

module.exports = {
  "content-change": contentChange, // key should re-use the singularName of the content-type
  "deploy-site-setting": deploySiteSettings,
};
