module.exports = ({ env }) => ({
  defaultConnection: env('DATABASE', 'default'),
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'sqlite',
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
      },
      options: {
        useNullAsDefault: true,
        pool: {
          propagateCreateError: false,
        },
      },
    },
    // This is for testing Psql compatibility, i.e. are column names short enough...
    psql: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: env("STRAPI_DATABASE_CONNECTION_NAME"),
        database: env("STRAPI_DATABASE_NAME"),
        username: env("STRAPI_DATABASE_USERNAME"),
        password: env("STRAPI_DATABASE_PASSWORD"),
      },
      options: {},
    }
  },
});
