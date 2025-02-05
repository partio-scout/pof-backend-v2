const path = require("path");

module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_V4_HOST", "localhost"),
      port: env.int("DATABASE_V4_PORT", 5432),
      database: env("DATABASE_V4_DATABASE", "strapi_v4"),
      user: env("DATABASE_V4_USER", "user"),
      password: env("DATABASE_V4_PASSWORD", "pass"),
      schema: env("DATABASE_V4_SCHEMA", "public"), // Not required
    },
    debug: false,
  },
});
// module.exports = ({ env }) => ({
//   connection: {
//     client: "sqlite",
//     connection: {
//       filename: path.join(
//         __dirname,
//         "..",
//         env("DATABASE_FILENAME", ".tmp/data.db")
//       ),
//     },
//     useNullAsDefault: true,
//   },
// });
