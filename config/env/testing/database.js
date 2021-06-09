module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: env("STRAPI_DATABASE_CONNECTION_NAME"),
        database: env("STRAPI_DATABASE_NAME"),
        username: env("STRAPI_DATABASE_USERNAME"),
        password: env("STRAPI_DATABASE_PASSWORD"),
      },
      options: {},
    },
  },
});

