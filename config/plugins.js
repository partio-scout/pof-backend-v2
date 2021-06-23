module.exports = ({ env }) => ({
  email: {
    provider: "sendgrid",
    providerOptions: {
      apiKey: env("SENDGRID_API_KEY"),
    },
    settings: {
      defaultFrom: env("SENDGRID_DEFAULT_FROM_ADDRESS"),
      defaultReplyTo: env("SENDGRID_DEFAULT_REPLY_TO_ADDRESS"),
    },
  },
});
