const http = require("http");
const Strapi = require("@strapi/strapi");

// async function setupStrapi() {
//   if (!instance) {
//     await Strapi().start();
//     instance = strapi;
//   }
//   return instance;
// }

let instance;

async function setupStrapi() {
  console.log("tuleeks tää tänne", instance);
  if (!instance) {
    /**
     * The following code in copied from `./node_modules/strapi/lib/Strapi.js`.
     *
     * Strapi() call sets strapi as a global variable.
     * */

    instance = await Strapi().load();
    await instance.app
      .use(instance.router.routes()) // populate KOA routes
      .use(instance.router.allowedMethods()); // populate KOA methods

    instance.server = http.createServer(instance.app.callback());
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

  return await strapi.plugins[
    "users-permissions"
  ].services.userspermissions.updateRole(roleID, updateObj);
};

module.exports = { setupStrapi, grantPriviledge };
