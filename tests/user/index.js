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

describe("Authentication", () => {
  it("should login user and return jwt token", async () => {
    /** Creates a new user and save it to the database */
    const uniqueSuffix = Date.now().toString();
    const uniqueUser = {
      ...mockUserData,
      email: `test${uniqueSuffix}@strapi.com`,
      username: `testuser${uniqueSuffix}`,
    };
    await strapi.plugins["users-permissions"].services.user.add(uniqueUser);

    await request(strapi.server.httpServer) // app server is an instance of Class: http.Server
      .post("/api/auth/local")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        identifier: uniqueUser.email,
        password: mockUserData.password,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        console.log("🤔🤔 resopnse", data); // Check the status code
        expect(data.body.jwt).toBeDefined();
      });
  });

  it.only("should return users data for authenticated user", async () => {
    /** Gets the default user role */
    // const defaultRole = await strapi
    //   .query("role", "users-permissions")
    //   .findOne({}, []);
    // const role = defaultRole ? defaultRole.id : null;

    const defaultRole = await strapi.entityService.findMany(
      "plugin::users-permissions.role",
      {
        filters: { type: "public" },
        limit: 1,
      }
    );
    const role = defaultRole.length > 0 ? defaultRole[0].id : null;

    /** Creates a new user an push to database */
    const user = await strapi.plugins["users-permissions"].services.user.add({
      ...mockUserData,
      username: "tester2",
      email: "tester2@strapi.com",
      role,
    });

    const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
      id: user.id,
    });

    await request(strapi.server.httpServer) // app server is an instance of Class: http.Server
      .get("/users/me")
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
