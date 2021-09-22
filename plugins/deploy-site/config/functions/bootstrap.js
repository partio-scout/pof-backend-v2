module.exports = async () => {
  registerPermissionActions();
};

const registerPermissionActions = () => {
  const actions = [
    {
      section: "settings",
      displayName: "Access deploy-site in the settings",
      uid: "settings.access",
      category: "deploy-site",
      pluginName: "deploy-site",
    },
    {
      section: "plugins",
      displayName: "Can deploy site",
      uid: "deploy",
      pluginName: "deploy-site",
    },
  ];

  const { actionProvider } = strapi.admin.services.permission;
  actionProvider.registerMany(actions);
};
