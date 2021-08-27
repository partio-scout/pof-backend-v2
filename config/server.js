module.exports = ({ env }) => {
  let siteUrl = env("WEBSITE_HOSTNAME");

  // If siteUrl is set and doesn't start with 'http(s)://', we need to set it
  if (siteUrl && siteUrl.match(/^https?:\/\//) === null) {
    siteUrl = 'https://' + siteUrl;
  }

  return {
    host: env("HOST", "0.0.0.0"),
    port: env.int("PORT", 1337),
    url: siteUrl,
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
  };
};
