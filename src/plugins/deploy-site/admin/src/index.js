import React from "react";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import App from "./containers/App";
import Initializer from "./containers/Initializer";
import lifecycles from "./lifecycles";
import trads from "./translations";

export default {
  register(app) {
    const pluginDescription =
      pluginPkg.strapi.description || pluginPkg.description;
    const icon = pluginPkg.strapi.icon;
    const name = pluginPkg.strapi.name;
    const plugin = {
      blockerComponent: null,
      blockerComponentProps: {},
      description: pluginDescription,
      icon,
      id: pluginId,
      initializer: Initializer,
      injectedComponents: [],
      isReady: false,
      isRequired: pluginPkg.strapi.required || false,
      layout: null,
      lifecycles,
      mainComponent: App,
      name,
      preventComponentRendering: false,
      trads,
      menu: {
        pluginsSectionLinks: [
          {
            destination: `/plugins/${pluginId}`,
            icon,
            label: {
              id: `${pluginId}.plugin.name`,
              defaultMessage: "Deployment",
            },
            name,
            permissions: [
              // Uncomment to set the permissions of the plugin here
              {
                action: "plugins::deploy-site.deploy", // the action name should be plugins::plugin-name.actionType
                subject: null,
              },
            ],
          },
        ],
      },
    };
    app.registerPlugin(plugin);
  },
};
