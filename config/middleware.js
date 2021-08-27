module.exports = ({ env }) => ({
  settings: {
    cache: {
      enabled: true,
      // This dictates which content types are cached
      models: ["activities", "age-groups", "activity-groups", "suggestions", "comments", "content-pages"],
    },
  },
});
