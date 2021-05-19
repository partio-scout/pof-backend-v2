# pof-backend-v2

A Strapi server for serving `partio-ohjelma.fi's` and other services' data.

## Running locally

To start run:

`yarn install`

and then:

`yarn develop`

Then you need to create an admin user by going to `http://localhost:1337/admin` (it probably opens automatically).


## Notes

Since Strapi is missing `Sámi` locales (for now), they are added via a patch file `patches/strapi-plugin-i18n+3.6.1.patch`, which is automatically run after `yarn install` and such.