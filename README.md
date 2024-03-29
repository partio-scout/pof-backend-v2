# pof-backend-v2

A Strapi server for serving `partio-ohjelma.fi's` and other services' data.

---

## Running locally

To start run:

`yarn install`

and then:

`yarn develop`

Then you need to create an admin user by going to `http://localhost:1337/admin` (it probably opens automatically).

## Create locales

Strapi keeps the used locales only in the database, so they have to be added manually. Go to `http::localhost:1337/admin/settings/internationalization` and add locales: `fi`, `sv`, `sme` and `smn`. Then make `fi` the default locale from it's `advanced settings`.

---

## Deployments
Anything pushed to the `staging` branch is automatically deployed to the test environment. When ready to deploy to production create a PR from `staging` to `main` and Github actions will deploy to the production environment.

## Migrations

Content can be migrated from `pof-api-v1` by using the script `migrations/run.js`.

### Setup
The migration script needs a configuration file `migrations/data/config.json`, which should look like this:
```json
{
  "strapiUrl": "http://localhost:1337", // The url of the target Strapi server
  "strapiAdminToken": "..." // A jwt token for an admin user for that Strapi server
}
```

You can get the jwt for your local admin user by making a POST request to `http://localhost:1337/admin/login` with following data:
```json
{
	"email": "<your admin user's email>",
	"password": "<your admin user's password>"
}
```

The answer contains the jwt in the field `data.token`.

If you don't care about the migrations nuances, and just want to get some data into your Strapi, skip to [here](#Adding-data-for-testing/development)

---

### Actions

Migration is split into two phases: **fetching** the data from the old system & **writing** the data to the new system.

NOTE: When running migrations, you should run Strapi with command `yarn start` and NOT with `yarn develop`, because in development mode the server is restarted on file changes, which our migration makes, and it messes up things.
#### Fetching
The fetching phase reads the program data from the endpoint: `https://pof-backend.partio.fi/spn-ohjelma-json-taysi` and then also from many other endpoints in the same api, that are in the initial data. The initial endpoint can be changed with parameter `-d (--dataUrl)`.

The the old api's responses are cached by default, so that subsequent runs don't hit the api. This is done because the old api is fairly slow, and we don't want the development to be slow. Caching can be disabled with option `-n (--noCache)`, which will disable the use of the cached data, but still keeps writing it so we can use the new responses later if needed. The cached data is written in file `migrations/data/data_cache.json`.

After the data is fetched, it is written to disk in a form that is easily used by the `writing` phase. The data is saved in file `migrations/data/program_data.json`, and if you don't want to fetch the data yourself, you can ask for the file from a colleague.

#### Writing
The writing phase reads the data file created by the fetching phase (`migrations/data/program_data.json`), and writes it to Strapi via it's REST-api. By default only new entries are written, and existing ones are skipped. To write everything, add the parameter `-u (--forceUpdate)`.

---

### Examples

You can run one or both of those phases by giving these arguments to the script: 
 - `-f (--fetch)` for fetching
 - `-w (--write)` for writing

So if you want to fetch the data, run:   
```
node migration/run.js -f
```

And if you want to write the already fetched data, run:  
```
node migrations/run.js -w
```

And if you want to run both of those, run:  
```
node migrations/run.js -fw
```

And if you want to update everything, run:
```
node migrations/run.js -wu
```
---
### Adding data for testing/development

A small amount of content can be added via the migration script by giving it the argument `-t (--test)`. This will only write the first Age Group's data to Strapi. To get things going fast, ask for an existing data file from a colleague and put it to `migrations/data/program_data.json`, and then run command:
```
node migrations/run.js -wt
```

---

## Email plugin

Our Strapi uses [Sendgrid](https://sendgrid.com/) to send emails, and it is done by using `strapi-provider-email-sendgrid` package. The package needs three environment variables: `SENDGRID_API_KEY`, `SENDGRID_DEFAULT_FROM_ADDRESS` and `SENDGRID_DEFAULT_REPLY_TO_ADDRESS`, and values fro those can be gotten from the client, who owns the Sendgrid account.
## Indexing content to Algolia

Content is indexed to Algolia search engine by using hook `strapi-hook-algolia`. Indexable content types are specified by setting up indexing in their lifecycle events, in file `api/<content type>/models/<content type>.js`. `strapi-hook-algolia` needs also two environment variables: `ALGOLIA_APPLICATION_ID` and `ALGOLIA_API_KEY` and they can be gotten from the [Algolia Console](https://www.algolia.com/dashboard). With these configurations content is indexed automatically when needed.

Content can also be indexed in bulk with created plugin `search-indexer`, which is described [here](./plugins/search-indexer/README.md).

Algolia's settings are saved in `/algolia-settings/settings.js`. If you modify the settings from Algolia's web console and want to save them here, just export the index's configuration and update it to the settings file to `indexes/<index name>`.
You can run the settings to algolia with the utility `algolia-settings/set-settings.js`, which takes the application id and admin token as parameters, like this:
```bash
node algolia-settings/set-settings.js <application id> <admin token>
```

---

## Notes

Since Strapi is missing `Sámi` locales (for now), they are added via a patch file `patches/strapi-plugin-i18n+3.6.1.patch`, which is automatically run after `yarn install` and such.

Another patch: `patches/strapi-middleware-cache+1.5.0.patch` is for fixing a bug in that package. There is an issue about it already in [GitHub](https://github.com/patrixr/strapi-middleware-cache/issues/54).

