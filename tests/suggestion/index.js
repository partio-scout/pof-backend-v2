const request = require("supertest");
const { grantPriviledge } = require("../helpers/strapi");

describe("Suggestions controller", () => {
  beforeAll(async () => {
    // Grant priviledges to to controllers so they can be invoked anonymously
    await Promise.all([
      await grantPriviledge(
        2,
        "permissions.application.controllers.api::suggestion.new"
      ),
      await grantPriviledge(
        2,
        "permissions.application.controllers.suggestion.like"
      ),
      await grantPriviledge(
        2,
        "permissions.application.controllers.suggestion.unlike"
      ),
      await grantPriviledge(
        2,
        "permissions.application.controllers.suggestion.comment"
      ),
    ]);
  });

  describe("/suggestions/new", () => {
    it("should create new suggestion with `from_web` true and `published_at` null, and return it", async () => {
      const data = await request(strapi.server.httpServer)
        .post("/suggestions/new")
        .set("Content-Type", "application/json")
        .send({
          title: "title",
          content: "content",
          author: "author",
        })
        .expect(200);

      const verifyEntry = (entry) => {
        expect(entry.title).toEqual("title");
        expect(entry.content).toEqual("content");
        expect(entry.author).toEqual("author");
        expect(entry.publishedAt).toBeNull();
        expect(entry.from_web).toEqual(true);
      };

      const entry = await strapi.db.query("api::suggestion.suggestion").findOne({ where: { id: data.body.id }, });

      // verify from database
      verifyEntry(entry);

      // verify the response
      verifyEntry(data.body);
    });
  });

  describe("/suggestions/<id>/like", () => {
    it("should increase like_count and return the updated entry", async () => {
      const suggestion = await request(strapi.server.httpServer)
        .post("/suggestions/new")
        .set("Content-Type", "application/json")
        .send({
          title: "title",
          content: "content",
          author: "author",
          likes: []
        })
        .expect(200);
      const suggestionId = suggestion.body.id;

      const data = await request(strapi.server.httpServer)
        .post(`/suggestions/${suggestionId}/like`)
        .set("Content-Type", "application/json")
        .send({
          user: "user1",
        })
        .expect(200);

      const verifyEntry = (entry, id) => {
        expect(entry.id).toEqual(id);
        expect(entry.like_count).toEqual(1);
      };

      const entry = await strapi.db.query("api::suggestion.suggestion").findOne({ where: { id: suggestionId }});

      // verify from database
      verifyEntry(entry, suggestionId);

      // veridy the response
      verifyEntry(data.body, suggestionId);
    });
    it("should not allow multiple likes to same suggestion from one user", async () => {
      const suggestion = await request(strapi.server.httpServer)
        .post("/suggestions/new")
        .set("Content-Type", "application/json")
        .send({
          title: "title",
          content: "content",
          author: "author",
          likes: []
        })
        .expect(200);
      const suggestionId = suggestion.body.id;

      await request(strapi.server.httpServer)
        .post(`/suggestions/${suggestionId}/like`)
        .set("Content-Type", "application/json")
        .send({
          user: "user1",
        })
        .expect(200)
        .then((data) => {
          expect(data.body.id).toEqual(suggestionId);
          expect(data.body.like_count).toEqual(1);
        });

      await request(strapi.server.httpServer)
        .post(`/suggestions/${suggestionId}/like`)
        .set("Content-Type", "application/json")
        .send({
          user: "user1",
        })
        .expect(400)
        .then((data) => {
          expect(data.text).toEqual("already liked");
        });
    });
    it("should return 404 when liking nonexistent suggestion", async () => {
      // Create a comment to that suggesion
      await request(strapi.server.httpServer)
        .post(`/suggestions/99/like`)
        .set("Content-Type", "application/json")
        .send({
          user: "test",
        })
        .expect(404);
    });
  });

  describe("/suggestions/<id>/unlike", () => {
    it("should decrease like_count and return the updated entry", async () => {
      // create a suggestion
      const suggestion = await request(strapi.server.httpServer)
      .post("/suggestions/new")
      .set("Content-Type", "application/json")
      .send({
        title: "title",
        content: "content",
        author: "author",
        likes: []
      })
      .expect(200);
      const suggestionId = suggestion.body.id;

      const verifyEntry = (entry, id, likeCount) => {
        expect(entry.id).toEqual(id);
        expect(entry.like_count).toEqual(likeCount);
      };

      const response1 = await request(strapi.server.httpServer)
        .post(`/suggestions/${suggestionId}/like`)
        .set("Content-Type", "application/json")
        .send({
          user: "user1",
        })
        .expect(200);

      // Verify that the like was added
      const entry1 = await strapi.db.query("api::suggestion.suggestion").findOne({ where: { id: suggestionId }});

      // verify from database
      verifyEntry(entry1, suggestionId, 1);

      // verify the response
      verifyEntry(response1.body, suggestionId, 1);

      const response2 = await request(strapi.server.httpServer)
        .post(`/suggestions/${suggestionId}/unlike`)
        .set("Content-Type", "application/json")
        .send({
          user: "user1",
        })
        .expect(200);

      // Verify that the like was removed
      const entry2 = await strapi.db.query("api::suggestion.suggestion").findOne({ where: { id: suggestionId }});

      // verify from database
      verifyEntry(entry2, suggestionId, 0);

      // verify the response
      verifyEntry(response2.body, suggestionId, 0);
    });

    it("should not allow unliking of a not liked suggestion", async () => {
      const suggestion = await request(strapi.server.httpServer)
        .post("/suggestions/new")
        .set("Content-Type", "application/json")
        .send({
          title: "title",
          content: "content",
          author: "author",
          likes: []
        })
        .expect(200);
      const suggestionId = suggestion.body.id;

      await request(strapi.server.httpServer)
        .post(`/suggestions/${suggestionId}/unlike`)
        .set("Content-Type", "application/json")
        .send({
          user: "user1",
        })
        .expect(400)
        .then((data) => {
          expect(data.text).toEqual("not liked");
        });
    });
    it("should return 404 when unliking nonexistent suggestion", async () => {
      // Create a comment to that suggesion
      await request(strapi.server.httpServer)
        .post(`/suggestions/99999999/unlike`)
        .set("Content-Type", "application/json")
        .send({
          user: "test",
        })
        .expect(404);
    });
  });

  describe("/suggestions/<id>/comment", () => {
    it("should return 404 when commenting nonexistent suggestion", async () => {
      // Create a comment to that suggesion
      await request(strapi.server.httpServer)
        .post(`/suggestions/9999999/comment`)
        .set("Content-Type", "application/json")
        .send({
          text: "A test comment",
          author: "tester",
        })
        .expect(404);
    });
  });
});
