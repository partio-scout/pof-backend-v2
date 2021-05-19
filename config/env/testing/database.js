module.exports = {};

// NEEDS AZURE IMPLEMENTATION
// module.exports = ({ env }) => ({
//   defaultConnection: "default",
//   connections: {
//     default: {
//       connector: "bookshelf",
//       settings: {
//         client: "postgres",
//         host: `/cloudsql/${env("STRAPI_INSTANCE_CONNECTION_NAME_TESTING")}`,
//         database: env("STRAPI_DATABASE_NAME_TESTING"),
//         username: env("STRAPI_DATABASE_USERNAME_TESTING"),
//         password: env("STRAPI_DATABASE_PASSWORD_TESTING"),
//       },
//       options: {},
//     },
//   },
// });
