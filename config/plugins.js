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
});
