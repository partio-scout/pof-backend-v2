module.exports = ({ env }) => ({
  // This configures Azure Storage as our media repository
  upload: {
    provider: "azure-storage",
    providerOptions: {
      account: env("STORAGE_ACCOUNT"),
      accountKey: env("STORAGE_ACCOUNT_KEY"),
      containerName: env("STORAGE_CONTAINER_NAME"),
      defaultPath: "assets",
      maxConcurrent: 10,
    },
  },
});
