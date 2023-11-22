import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import { prefixPluginTranslations } from "@strapi/helper-plugin";
import DeploymentPluginIcon from "./components/PluginIcon";

export default {
  register(app) {
    const { name } = pluginPkg.strapi;
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: DeploymentPluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: "Deployment",
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "[request]" */ "./pages/App"
        );

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        {
          action: "plugin::deploy-site.deploy", // the action name should be plugin::plugin-name.actionType
          subject: null,
        },
      ],
    });
    app.registerPlugin({
      // description: pluginDescription,
      id: pluginId,
      name,
      initializer: Initializer,
      isReady: false,
    });
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "[pluginId]-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
