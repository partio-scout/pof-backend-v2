const request = require("supertest");

// user mock data
const mockUserData = {
  username: "tester",
  email: "tester@strapi.com",
  provider: "local",
  password: "1234abc",
  confirmed: true,
  blocked: null,
};
const createUniqueUser = (uniqueSuffix) => ({
  ...mockUserData,
  email: `test${uniqueSuffix}@strapi.com`,
  username: `testuser${uniqueSuffix}`,
});

describe("Authentication", () => {
  it("should login user and return jwt token", async () => {
    /** Creates a new user and save it to the database */
    const randomNumber = Math.random();
    const uniqueUser = createUniqueUser(randomNumber);
    await strapi.entityService.create("plugin::users-permissions.user", {
      data: uniqueUser,
    });

    await request(strapi.server.httpServer) // app server is an instance of Class: http.Server
      .post("/api/auth/local")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        identifier: uniqueUser.email,
        password: uniqueUser.password,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.jwt).toBeDefined();
      });
  });

  it("should return users data for authenticated user", async () => {
    /** Gets the default user role */

    const defaultRole = await strapi.entityService.findMany(
      "plugin::users-permissions.role",
      {
        filters: { type: "authenticated" },
        limit: 1,
      }
    );
    const role = defaultRole.length > 0 ? defaultRole[0].id : null;

    const randomNumber = Math.random();
    const uniqueUser = createUniqueUser(randomNumber);
    /** Creates a new user an push to database */
    const user = await strapi.entityService.create("plugin::users-permissions.user", {
      data: {
        ...uniqueUser,
        role
      },
    });

    const jwt = await strapi.service("plugin::users-permissions.jwt").issue({
      id: user.id,
    });

    await request(strapi.server.httpServer) // app server is an instance of Class: http.Server
      .get("/api/users/me")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + jwt)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body).toBeDefined();
        expect(data.body.id).toBe(user.id);
        expect(data.body.username).toBe(user.username);
        expect(data.body.email).toBe(user.email);
      });
  });
});
