import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import lifecycles from "./lifecycles";
import trads from "./translations";
import SearchIndexerPluginIcon from "./components/PluginIcon";

export default {
  register(app) {
    const { name } = pluginPkg.strapi;
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: SearchIndexerPluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: "Search Indexer",
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "[request]" */ "./pages/App"
        );
        return component;
      },
      // permissions: [],
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: "plugins::search-indexer.index", // the action name should be plugins::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    app.registerPlugin({
      description: pluginPkg.strapi.description,
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
