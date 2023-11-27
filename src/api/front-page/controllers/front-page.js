'use strict';

/**
 * front-page controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::front-page.front-page');