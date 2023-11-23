module.exports = [
  {
    method: "GET",
    path: "/",
    handler: "deploy-site.index",
    // config: {
    //   policies: ["admin::hasPermissions"],
    // },
  },
  {
    method: "POST",
    path: "/set",
    handler: "deploy-site.set",
    // config: {
    //   policies: [
    //     "admin::hasPermissions",
    //     "plugins::deploy-site.settings.access",
    //   ],
    // },
  },
  {
    method: "GET",
    path: "/changes",
    handler: "deploy-site.changes",
    // config: {
    //   policies: ["admin::hasPermissions", "plugins::deploy-site.deploy"],
    // },
  },
  {
    method: "GET",
    path: "/deploy",
    handler: "deploy-site.deploy",
    // config: {
    //   policies: ["admin::hasPermissions", "plugins::deploy-site.deploy"],
    // },
  },
];
