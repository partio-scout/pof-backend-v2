import React from 'react';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import App from './containers/App';
import Settings from './containers/Settings';
import Initializer from './containers/Initializer';
import lifecycles from './lifecycles';
import trads from './translations';

export default strapi => {
  const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
  const icon = pluginPkg.strapi.icon;
  const name = pluginPkg.strapi.name;

  // Declare the links that will be injected into the settings menu
  const menuSection = {
    id: pluginId,
    title: {
      id: `${pluginId}`,
      defaultMessage: 'Deploy site',
    },
    links: [
      {
        title: 'Deploy settings',
        to: `${strapi.settingsBaseURL}/${pluginId}`,
        name: 'setting1',
        permissions: [{ action: 'plugins::deploy-site.settings.access', subject: null }],
        Component: () => <Settings />
      },

    ],
  };

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
    settings: {
      mainComponent: Settings,
      menuSection,
    },
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
              action: 'plugins::deploy-site.deploy', // the action name should be plugins::plugin-name.actionType
              subject: null,
            },
          ],
        },
      ],
    },
  };

  return strapi.registerPlugin(plugin);
};
