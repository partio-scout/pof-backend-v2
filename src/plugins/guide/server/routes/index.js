module.exports = [
  {
    method: "GET",
    path: "/list",
    handler: "guide.listGuides",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/get/:id",
    handler: "guide.getGuide",
    config: {
      policies: [],
    },
  },
];
