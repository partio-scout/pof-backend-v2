# partiolaiset-strapi-poc

A simple Strapi server for testing and evaluating Strapi as a CMS.

To start run:

`yarn install`

and then:

`yarn develop`

Then you need to create an admin user by going to `http://localhost:1337/admin` (it probably opens automatically).

## Findings

### Content migrations

Content models can be created via `Content-Types Builder` in the admin UI, via json files in `/api/<content-type>/models/<content-type>.settings.json` or via [Strapi CLI](https://strapi.io/documentation/developer-docs/latest/developer-resources/cli/CLI.html#strapi-generate-model). There doesn't seem to be a way to create them via code like in `Contentful`.

Creation and updating of entries can be done easily from code if we don't care about localization. If we do however, then the easiest way seems to be the REST api which works for everything.
