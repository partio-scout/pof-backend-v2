module.exports = ({ env }) => ({
  "deploy-site": {
    enabled: true,
    resolve: "./src/plugins/deploy-site",
  },
  guide: {
    enabled: true,
    resolve: "./src/plugins/guide",
  },
  "search-indexer": {
    enabled: true,
    resolve: "./src/plugins/search-indexer",
  },
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: env("SENDGRID_DEFAULT_FROM_ADDRESS"),
        defaultReplyTo: env("SENDGRID_DEFAULT_REPLY_TO_ADDRESS"),
      },
    },
  },
});
