const request = require("supertest");
const { grantPriviledge } = require("../helpers/strapi");

describe("Suggestions controller", () => {
  beforeAll(async () => {
    // Grant priviledges to to controllers so they can be invoked anonymously
    await grantPriviledge(
      2,
      "permissions.application.controllers.suggestion.new"
    );
    await grantPriviledge(
      2,
      "permissions.application.controllers.suggestion.like"
    );
    await grantPriviledge(
      2,
      "permissions.application.controllers.suggestion.unlike"
    );
    await grantPriviledge(
      2,
      "permissions.application.controllers.suggestion.comment"
    );
  });

  it("`new` should create new suggestion with `from_web` true and `published_at` null", async () => {
    await request(strapi.server)
      .post("/suggestions/new")
      .set("Content-Type", "application/json")
      .send({
        title: "title",
        content: "content",
        author: "author",
      })
      .expect(200)
      .then((data) => {
        expect(data.body.title).toEqual("title");
        expect(data.body.content).toEqual("content");
        expect(data.body.author).toEqual("author");
        expect(data.body.published_at).toBeNull();
        expect(data.body.from_web).toEqual(true);
      });
  });

  it("`like` should increase like_count", async () => {
    // create a suggestion
    const suggestion = await strapi.services.suggestion.create({
      title: "title",
      content: "content",
      author: "author",
    });

    await request(strapi.server)
      .post(`/suggestions/${suggestion.id}/like`)
      .set("Content-Type", "application/json")
      .send({
        user: "user1",
      })
      .expect(200)
      .then((data) => {
        expect(data.body.id).toEqual(suggestion.id);
        expect(data.body.like_count).toEqual(1);
      });
  });
  it("`like` should not allow multiple likes to same suggestion from one user", async () => {
    // create a suggestion
    const suggestion = await strapi.services.suggestion.create({
      title: "title",
      content: "content",
      author: "author",
    });

    await request(strapi.server)
      .post(`/suggestions/${suggestion.id}/like`)
      .set("Content-Type", "application/json")
      .send({
        user: "user1",
      })
      .expect(200)
      .then((data) => {
        expect(data.body.id).toEqual(suggestion.id);
        expect(data.body.like_count).toEqual(1);
      });

    await request(strapi.server)
      .post(`/suggestions/${suggestion.id}/like`)
      .set("Content-Type", "application/json")
      .send({
        user: "user1",
      })
      .expect(400)
      .then((data) => {
        expect(data.text).toEqual("already liked");
      });
  });

  it("`unlike` should decrease like_count", async () => {
    // create a suggestion
    const suggestion = await strapi.services.suggestion.create({
      title: "title",
      content: "content",
      author: "author",
    });

    await request(strapi.server)
      .post(`/suggestions/${suggestion.id}/like`)
      .set("Content-Type", "application/json")
      .send({
        user: "user1",
      })
      .expect(200)
      .then((data) => {
        expect(data.body.id).toEqual(suggestion.id);
        expect(data.body.like_count).toEqual(1);
      });

    await request(strapi.server)
      .post(`/suggestions/${suggestion.id}/unlike`)
      .set("Content-Type", "application/json")
      .send({
        user: "user1",
      })
      .expect(200)
      .then((data) => {
        expect(data.body.id).toEqual(suggestion.id);
        expect(data.body.like_count).toEqual(0);
      });
  });

  it("`unlike` should not allow unliking of a not liked suggestion", async () => {
    // create a suggestion
    const suggestion = await strapi.services.suggestion.create({
      title: "title",
      content: "content",
      author: "author",
    });

    await request(strapi.server)
      .post(`/suggestions/${suggestion.id}/unlike`)
      .set("Content-Type", "application/json")
      .send({
        user: "user1",
      })
      .expect(400)
      .then((data) => {
        expect(data.text).toEqual("not liked");
      });
  });
});
