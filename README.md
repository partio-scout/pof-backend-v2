# pof-backend-v2

A Strapi server for serving `partio-ohjelma.fi's` and other services' data.

---

## Running locally

Use node version 18.13.0

To start run:

`yarn install`

and then:

`yarn develop`

Then you need to create an admin user by going to `http://localhost:1337/admin` (it probably opens automatically).

## Create locales

Strapi keeps the used locales only in the database, so they have to be added manually. Go to `http::localhost:1337/admin/settings/internationalization` and add locales: `fi`, `sv`, `sme` and `smn`. Then make `fi` the default locale from it's `advanced settings`.

## Deployments

Anything pushed to the `staging` branch is automatically deployed to the test environment. When ready to deploy to production create a PR from `staging` to `main` and Github actions will deploy to the production environment.

### Adding data for development

Set up a local postgres data by runnig `docker compose up`, There is data dump migrated from pof-backend testing in 1Password named _migrated pof-testing data for strapi v4_. Import the data dumb to your local postgres database.

## Email plugin

Our Strapi uses [Sendgrid](https://sendgrid.com/) to send emails, and it is done by using `strapi-provider-email-sendgrid` package. The package needs three environment variables: `SENDGRID_API_KEY`, `SENDGRID_DEFAULT_FROM_ADDRESS` and `SENDGRID_DEFAULT_REPLY_TO_ADDRESS`, and values fro those can be gotten from the client, who owns the Sendgrid account.

## Indexing content to Algolia

Content is indexed to Algolia search engine by `algoliasearch` package. Indexable content types are specified by setting up indexing in their lifecycle events, in file `api/<content type>/content-types/<content type>/lifecycles.js`. `algoliasearch` needs also two environment variables: `ALGOLIA_APPLICATION_ID` and `ALGOLIA_API_KEY` and they can be gotten from the [Algolia Console](https://www.algolia.com/dashboard). With these configurations content is indexed automatically when needed.

Production and testing environments are located in same Algolia instance with environment suffix -for example `testing_activity` and `production_activity`. If you need Algolia for development, you may create new Algolia instance and change the `ALGOLIA_API_KEY` from .env file. Normally you don't need to set up algolia for local development at all.

Content can also be indexed in bulk with created plugin `search-indexer`, which is described [here](./src/plugins/search-indexer/README.md).

Algolia's settings are saved in `/algolia-settings/settings.js`. If you modify the settings from Algolia's web console and want to save them here, just export the index's configuration and update it to the settings file to `indexes/<index name>`.
You can run the settings to algolia with the utility `algolia-settings/set-settings.js`, which takes the application id and admin token as parameters, like this:

```bash
node algolia-settings/set-settings.js <application id> <admin token>
```

---

## Custom plugins

Our custom plugins are located in ./src/plugins/

- search-indexer
  - Algolia bulk indexing plugin. [README](./src/plugins/search-indexer/README.md)
- deploy-site
  - Creates new content-type `Content-change` and lists all the modifications here. You can trigger build webhook to Netlify from Deployment tab. Remember to add deploy_webhook_url (pointing to Netlify) to deploy-site-setting Single type in Content manager.
- guide

## Custom fields

- Tinymce plugin

## Notes

!! This seems to be fixed in strapi v4.

Since Strapi is missing `Sámi` locales (for now), they are added via a patch file `patches/strapi-plugin-i18n+3.6.1.patch`, which is automatically run after `yarn install` and such.

Another patch: `patches/strapi-middleware-cache+1.5.0.patch` is for fixing a bug in that package. There is an issue about it already in [GitHub](https://github.com/patrixr/strapi-middleware-cache/issues/54).
