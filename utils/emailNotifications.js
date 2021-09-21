const { getSettings } = require('../utils/content');

const notifyAboutContent = async (content, type, title = undefined) => {
  const settings = await getSettings();

  if (!settings) {
    console.warn('Settings content is not created, not sending notification emails');
    return;
  }

  const recipients = settings.suggestion_notification_recipients
    ?.split(",")
    .map((email) => email.trim()) || [];
 
  await Promise.all(
    recipients.map(
      async (recipient) =>
        await sendContentNotification(recipient, content, type, title)
    )
  );
};



const sendContentNotification = async (recipient, content, type, title = undefined) => {
  console.log("Sending new content notification to:", recipient);

  const emailConfig = {
    to: recipient,
    subject: `Uusi ${type}`,
    text: `Partio-ohjelmaan on lähetetty uusi ${type}: ${title || content.title || content.name}`,
  };

  try {
    await strapi.plugins.email.services.email.send(emailConfig);
  } catch (error) {
    console.error("Error while sending email:", error);
  }
};

module.exports = {
  notifyAboutContent,
}