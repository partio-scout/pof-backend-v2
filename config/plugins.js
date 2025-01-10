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
  tinymce: {
    enabled: true,
  },
  transformer: {
    enabled: true,
    config: {
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      },
      requestTransforms: {
        wrapBodyWithDataKey: true,
      },
    },
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
  'users-permissions': {
    config: {
    jwtSecret: env('JWT_SECRET')
    }
  },
  upload: {
    config: {
      sizeLimit: 250 * 1024 * 1024, // Now
    }
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
});
