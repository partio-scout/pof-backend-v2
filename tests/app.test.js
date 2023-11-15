const fs = require("fs");
const { setupStrapi } = require("./helpers/strapi");

// /** this code is called once before any test is called */
beforeAll(async () => {
  console.log("täääää");
  await setupStrapi();
});

/** this code is called once before all the tested are finished */
afterAll(() => {
  const dbSettings = strapi.config.get("database.connections.default.settings");

  //delete test database after all tests
  if (dbSettings && dbSettings.filename) {
    const tmpDbFile = `${__dirname}/../${dbSettings.filename}`;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
});

describe("Strapi", () => {
  it("is defined", () => {
    expect(strapi).toBeDefined();
  });
});

require("./user");
require("./suggestion");
require("./utils/content");
require("./utils/algolia");
