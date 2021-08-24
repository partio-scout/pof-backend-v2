# Strapi plugin change-tracker

A custom plugin for tracking which content changes are published and which aren't.
This plugin works by writing all content changes to db, and then it compares their creation times to the last deployment's time.

Content changes that are deployed and over a month old are deleted automatically. (NOTE! Only the change data, not the content itself.)

This plugin depends on workflows created with another plugin: `strapi-plugin-github-actions`.

## Actions needed to work
- Create a deployment workflow (content type `Workflow`) with a name `Deploy site`.

- Add the following cron job to `/config/functions/cron.js`:
  ```javascript
  module.exports = {
    ...,
    // This one
    "* * * * *": async () => await strapi.plugins["change-tracker"].  services['change-tracker'].checkForChanges(),
  };
  ```


