'use strict';

/**
 * front-page service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::front-page.front-page');