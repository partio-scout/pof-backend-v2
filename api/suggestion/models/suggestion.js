"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterCreate(result, data) {
      if (result.from_web) {
        await notifyAboutSuggestion(result, process.env.SITE_URL);
      }
    },
  },
};

const contentPath =
  "admin/plugins/content-manager/collectionType/application::suggestion.suggestion";

const notifyAboutSuggestion = async (suggestion, siteUrl) => {
  const settings = await getSettings();

  const recipients = settings.suggestion_notification_recipients?.split(",");

  await Promise.all(
    recipients.map(
      async (recipient) =>
        await sendSuggestionNotification(recipient, suggestion, siteUrl)
    )
  );
};

const getSettings = async () => {
  return await strapi.services.settings.find();
};

const sendSuggestionNotification = async (recipient, suggestion, siteUrl) => {
  console.log("Sending new suggestion notification to:", recipient);

  const emailConfig = {
    to: recipient,
    subject: "Uusi toteutusehdotus",
    html: `
      <p>Partio-ohjelmaan on lähetetty uusi toteutusehdotus: ${suggestion.title}, kirjoittaja: ${suggestion.author}.</p>
      <p>Voit tarkastella ja julkaista sen <a href="${siteUrl}/${contentPath}/${suggestion.id}">tästä</a></p>`,
  };

  await strapi.plugins.email.services.email.send(emailConfig);
};
