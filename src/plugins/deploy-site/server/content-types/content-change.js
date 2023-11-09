module.exports = {
  kind: "collectionType",
  collectionName: "content_changes",
  info: {
    singularName: "content-change", // kebab-case mandatory
    pluralName: "content-changes", // kebab-case mandatory
    displayName: "Content-change",
    description: "Content changes",
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {
    "content-manager": {
      visible: false,
    },
    "content-type-builder": {
      visible: false,
    },
  },
  attributes: {
    content_name: {
      type: "string",
      required: true,
    },
    content_type: {
      type: "string",
      required: true,
    },
    content_id: {
      type: "integer",
      required: true,
    },
    change_type: {
      type: "string",
      required: true,
    },
    change_time: {
      type: "datetime",
    },
    deployed_at: {
      type: "datetime",
    },
  },
};
