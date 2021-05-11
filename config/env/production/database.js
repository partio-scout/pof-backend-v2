module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: `/cloudsql/${env("STRAPI_INSTANCE_CONNECTION_NAME_DEV")}`,
        database: env("STRAPI_DATABASE_NAME_DEV"),
        username: env("STRAPI_DATABASE_USERNAME_DEV"),
        password: env("STRAPI_DATABASE_PASSWORD_DEV"),
      },
      options: {},
    },
  },
});
