module.exports =({ env }) => ({
  settings: {
    algolia: {
      enabled: true,
      applicationId: env('ALGOLIA_APPLICATION_ID'),
      apiKey: env('ALGOLIA_API_KEY'),
      debug: true,              // default: false
      // prefix: 'my_own_prefix'   // default: Strapi environment (strapi.config.environment)
    },
  }
});