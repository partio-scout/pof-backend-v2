module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("PUBLIC_URL", env("WEBSITE_HOSTNAME", "")),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "255a8bb6c62d421ce19160f15bea8aa9"),
    },
    watchIgnoreFiles: [
      "**/migrations/**",
      "**/tests/**",
      "**/algolia-settings/**",
    ],
  },
  cron: {
    enabled: true,
  },
});
