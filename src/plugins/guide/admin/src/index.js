import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import GuidePluginIcon from "./components/PluginIcon";
import Initializer from "./components/Initializer";

export default {
  register(app) {
    const { name } = pluginPkg.strapi;
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: GuidePluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: "Guide",
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "[request]" */ "./pages/App"
        );
        return component;
      },
      permissions: [],
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
