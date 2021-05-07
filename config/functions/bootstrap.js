"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

module.exports = async () => {
  // pagesToCreate.forEach((page) => createPage(page));
  // await addNumberToPages();
};

async function addNumberToPages() {
  console.log("Adding numbers to pages");

  /* 
    Services -> Reusable functions that are predefined by strapi with 
    some custom business logic (those are usually wrapped around the 
    query functions actually but with some additional custom logic inside them).
    These respect the draft system, i.e. they don't return unpublished entries (drafts).
    
    Query -> Direct query to database. These don't respect draft system, i.e. they return
    entries of all publication states.
  */
  // const pages = await strapi.services.page.find();
  const pages = await strapi.query("page").find();

  pages.forEach(async (page) => {
    console.log(
      `Adding number to page: ${page.Title} (id: ${page.id}, published: ${page.published_at})`
    );
    await strapi.services.page.update({ id: page.id }, { Number: page.id });
  });
}

async function createPage(pageData) {
  console.log("Creating page:", pageData.Title);
  await strapi.services.page.create({
    ...pageData,
  });
}

const pagesToCreate = [
  {
    Title: "Test fi 2",
    Content: "Some content",
    Slug: "/test-fi",
    locale: "fi",
    Blocks: [],
    Subpages: [],
  },
];
