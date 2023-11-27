'use strict';

/**
 * duration service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::duration.duration');