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
    //   policies: ["admin::hasPermissions"],
    // },
  },
  {
    method: "GET",
    path: "/changes",
    handler: "deploy-site.changes",
    // config: {
    //   policies: ["admin::hasPermissions"],
    // },
  },
  {
    method: "GET",
    path: "/deploy",
    handler: "deploy-site.deploy",
    // config: {
    //   auth: false,
    //   policies: ["admin::hasPermissions"],
    // },
  },
];
