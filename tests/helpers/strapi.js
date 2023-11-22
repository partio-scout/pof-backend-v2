const http = require("http");
const Strapi = require("@strapi/strapi");

let instance;

async function setupStrapi() {
  if (!instance) {
    try {
      await Strapi().load();
      instance = strapi;

      instance.server.mount();
    } catch (error) {
      console.error("Error during Strapi setup:", error);
      throw error;
    }
  }
  return instance;
}

/**
 * Grants priviledge for a role to access a controller's route. For example with roleID: `2` and value:
 * "permissions.application.controllers.suggestion.new", you allow `Public` role to access `suggestion.new` controller.
 *
 * This utility is necessary in testing, because the test database is blank for each run
 * and doesn't have any persmissions set, which means the test runner can't access them.
 *
 * @param {int} roleID, 1 Authenticated, 2 Public, etc
 * @param {string} value, in form or dot string eg `"permissions.users-permissions.controllers.auth.changepassword"`
 * @param {boolean} enabled, default true
 * @param {string} policy, default ''
 */
const grantPriviledge = async (roleID, value, enabled = true, policy = "") => {
  const updateObj = value
    .split(".")
    .reduceRight((obj, next) => ({ [next]: obj }), { enabled, policy });

  return await strapi
    .plugin("users-permissions")
    .services.role.updateRole(roleID, updateObj);
};

module.exports = { setupStrapi, grantPriviledge };
