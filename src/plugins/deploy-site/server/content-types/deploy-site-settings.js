module.exports = {
  kind: "singleType",
  collectionName: "deploy_site_settings",
  info: {
    singularName: "deploy-site-setting",
    pluralName: "deploy-site-settings",
    displayName: "deploy-site-setting",
    description: "Deploy site settings",
  },
  options: {
    draftAndPublish: false,
    timestamps: true,
    increments: true,
    comment: "",
  },
  attributes: {
    deploy_webhook_url: {
      type: "string",
    },
    preview_url: {
      type: "string",
    },
    preview_webhook_url: {
      type: "string",
    },
    track_content_changes: {
      type: "boolean",
      default: true,
    },
    preview_updates: {
      type: "boolean",
      default: true,
    },
  },
};
