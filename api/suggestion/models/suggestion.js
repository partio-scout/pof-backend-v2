"use strict";
const { createLifecycleHooks } = require("../../../utils/algolia");

const contentType = "suggestion";

const notifyAboutSuggestion = async (suggestion) => {
  const settings = await getSettings();

  const recipients = settings.suggestion_notification_recipients?.split(",");

  await Promise.all(
    recipients.map(
      async (recipient) =>
        await sendSuggestionNotification(recipient, suggestion)
    )
  );
};

const getSettings = async () => {
  return await strapi.services.settings.find();
};

const sendSuggestionNotification = async (recipient, suggestion) => {
  console.log("Sending new suggestion notification to:", recipient);

  const emailConfig = {
    to: recipient,
    subject: "Uusi toteutusehdotus",
    text: `Partio-ohjelmaan on lähetetty uusi toteutusehdotus: ${suggestion.title}, kirjoittaja: ${suggestion.author}.`,
  };

  await strapi.plugins.email.services.email.send(emailConfig);
};

module.exports = {
  lifecycles: {
    async afterCreate(result, data) {
      if (result.from_web) {
        await notifyAboutSuggestion(result);
      }
    },
    async beforeUpdate(params, data) {
      // Set the suggestion's like_count based on the current likes
      data.like_count = data.likes?.length || 0;
    },
    ...createLifecycleHooks(contentType),
  },
};
