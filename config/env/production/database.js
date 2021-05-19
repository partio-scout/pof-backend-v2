module.exports = {};

// NEEDS AZURE IMPLEMENTATION
// module.exports = ({ env }) => ({
//   defaultConnection: "default",
//   connections: {
//     default: {
//       connector: "bookshelf",
//       settings: {
//         client: "postgres",
//         host: `/cloudsql/${env("STRAPI_INSTANCE_CONNECTION_NAME_PRODUCTION")}`,
//         database: env("STRAPI_DATABASE_NAME_PRODUCTION"),
//         username: env("STRAPI_DATABASE_USERNAME_PRODUCTION"),
//         password: env("STRAPI_DATABASE_PASSWORD_PRODUCTION"),
//       },
//       options: {},
//     },
//   },
// });
