module.exports = [
  {
    method: "GET",
    path: "/:type",
    handler: "search-indexer.index",
    // config: {
    //   policies: ["admin::hasPermissions", "plugins::search-indexer.index"],
    // },
  },
];
