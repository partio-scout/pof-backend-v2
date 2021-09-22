module.exports = async () => {
  registerPermissionActions();
  addContentEventListeners();
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

/**
 * Write content changes to collection `content-change`
 * @param {string} eventType Strapi's event type
 * @param {Object} event Strapi's event object
 */
 const onContentEvent = async (eventType, event) => {
  const { entry, model } = event;

  const newChange = {
    content_name: entry.title || entry.name || "",
    content_type: model,
    content_id: entry.id,
    change_type: eventType,
    change_time: new Date(),
  };

  // If the change was not to a content-change or workflow entry, write it as a new content-change
  if (!["content-change", "workflow"].includes(newChange.content_type)) {
    console.log("Creating new content-change", newChange);
    await strapi.query("content-change", "change-tracker").create(newChange);
  }
};

/**
 * Add listener for an event type
 * @param {string} eventType Strapi's event type
 */
const addContentEventListener = (eventType) => {
  strapi.eventHub.on(
    eventType,
    async (event) => await onContentEvent(eventType, event)
  );
};

/**
 * Add listeners for content events (any kind of change).
 * The listeners create new `content-change` entries from the events.
 */
const addContentEventListeners = () => {
  /*
    Get all event types from strapi.

    Which are:
      "entry.create"
      "entry.update"
      "entry.delete"
      "entry.publish"
      "entry.unpublish"
  */
  const listenedEvents = strapi.eventHub.eventNames();

  // And add listeners for all of those
  listenedEvents.forEach(addContentEventListener);
};