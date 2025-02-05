'use strict';

/**
 * activity-level service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::activity-level.activity-level');