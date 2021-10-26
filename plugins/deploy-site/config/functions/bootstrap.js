const axios = require("axios");

module.exports = async () => {
  registerPermissionActions();
  addContentEventListeners();
};

const registerPermissionActions = () => {
  const actions = [
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
 * Trigger Gatsby preview update on content changes.
 * This replaces Strapi's webhook, because in those you can't dispatch them just for certain types.
 * @param {object}
 * @param {string} contentType Strapi's content type
 */
const triggerGatsbyPreviewUpdate = async (settings, contentType) => {
  if (!settings.preview_updates) return;

  const typesToNotUpdatePreviewFor = [
    "content-change",
    "workflow",
    "suggestion",
    "deploy-site-settings",
    "comment"
  ];

  if (settings.preview_webhook_url) {
    if (!typesToNotUpdatePreviewFor.includes(contentType)) {
      try {
        await axios.post(settings.preview_webhook_url, {});
        console.log("deploy-site: triggered Gatsby preview update");
      } catch (error) {
        console.error(
          "deploy-site: failed triggering Gatsby preview update:",
          error
        );
      }
    }
  } else {
    console.warn(
      "deploy-site: setting `preview_webhook_url` is not set, can't trigger Gatsby preview update"
    );
  }
};

/**
 * Write content changes to collection `content-change`
 * @param {string} eventType Strapi's event type
 * @param {Object} event Strapi's event object
 */
const onContentEvent = async (eventType, event) => {
  console.log('onContentEvent', eventType, event)
  const { entry, model } = event;

  const newChange = {
    content_name: entry.title || entry.name || "",
    content_type: model,
    content_id: entry.id,
    change_type: eventType,
    change_time: new Date(),
  };

  const [settings] = await strapi
    .query("deploy-site-settings", "deploy-site")
    .find();

  await triggerGatsbyPreviewUpdate(settings, model);

  if (!settings.track_content_changes) return;

  // If the change was not to a content-change, workflow entry or a suggestion, write it as a new content-change
  if (
    ![
      "content-change",
      "workflow",
      "suggestion",
      "deploy-site-settings",
      "comment"
    ].includes(newChange.content_type)
  ) {
    console.log("deploy-site: Creating new content-change", newChange);
    await strapi.query("content-change", "deploy-site").create(newChange);
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
  console.log('Added listener for content event', eventType);
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
