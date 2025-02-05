module.exports = async () => {
  registerPermissionActions();
};

const registerPermissionActions = () => {
  const actions = [
    {
      section: "plugins",
      displayName: "Can index content",
      uid: "index",
      pluginName: "search-indexer",
    },
  ];

  const { actionProvider } = strapi.admin.services.permission;
  actionProvider.registerMany(actions);
};
