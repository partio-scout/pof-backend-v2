const {
  getAgeGroupIdForActivity,
  getAgeGroupIdFromActivityGroup,
  isObject,
} = require("../../utils/content");

describe("Content utils", () => {
  let activities;
  let activityGroups;
  let ageGroup;

  beforeAll(async () => {
    /*
      Create content hierarchy for testing:
      - ageGroup
        - activityGroup3
          - activity-3
          - activityGroup2
            - activity2
            - activityGroup1
              - activity1
    */
    const activity1 = await strapi.query("api::activity.activity").create({
      title: "activity",
      content: "test",
    });
    const activity2 = await strapi.query("api::activity.activity").create({
      title: "activity",
      content: "test",
    });
    const activity3 = await strapi.query("api::activity.activity").create({
      title: "activity",
      content: "test",
    });

    const activityGroup1 = await strapi.query("api::activity-group.activity-group").create({
      title: "activity-group1",
      content: "test",
      activities: [activity1.id],
    });

    const activityGroup2 = await strapi.query("api::activity-group.activity-group").create({
      title: "activity-group2",
      content: "test",
      activity_groups: [activityGroup1.id],
      activities: [activity2.id],
    });

    const activityGroup3 = await strapi.query("api::activity-group.activity-group").create({
      title: "activity-group2",
      content: "test",
      activity_groups: [activityGroup2.id],
      activities: [activity3.id],
    });

    ageGroup = await strapi.query("api::age-group.age-group").create({
      title: "age-group1",
      content: "test",
      minimum_age: 1,
      maximum_age: 2,
      activity_groups: [activityGroup3.id],
    });
    activityGroups = [activityGroup1, activityGroup2, activityGroup3];
    activities = [activity1, activity2, activity3];
  });

  describe("getAgeGroupIdFromActivityGroup", () => {
    it("gets age-group directly over an activity-group", async () => {
      const ageGroupId = await getAgeGroupIdFromActivityGroup(
        activityGroups[2].id
      );

      expect(ageGroupId).toEqual(ageGroup.id);
    });
  });

  describe("getAgeGroupIdForActivity", () => {
    it("gets age-group directly over the parent activity-group", async () => {
      const ageGroupId = await getAgeGroupIdForActivity(activities[2].id);

      expect(ageGroupId).toEqual(ageGroup.id);
    });
  });

  describe("isObject", () => {
    it("returns true for object", () => expect(isObject({})).toEqual(true));
    it("returns false for string", () =>
      expect(isObject("asd")).toEqual(false));
    it("returns false for number", () => expect(isObject(1)).toEqual(false));
    it("returns false for boolean", () =>
      expect(isObject(true)).toEqual(false));
    it("returns false for date", () =>
      expect(isObject(new Date())).toEqual(false));
  });
});
