"use strict";

const services = require("./services");
const routes = require("./routes");
const controllers = require("./controllers");
const contentTypes = require("./content-types");
const bootstrap = require("./bootstrap");

module.exports = {
  bootstrap,
  contentTypes,
  controllers,
  routes,
  services,
};
