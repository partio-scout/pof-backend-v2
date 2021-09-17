/**
 * Checks if a value is an object
 * @param {any} value The value to test
 * @returns {boolean}
 */
const isObject = (value) =>
  Object.prototype.toString.call(value) === "[object Object]";

/**
 * Get the age-group's id that is an ancestor of this activity-group in the content hierarchy.
 * @param {number} id The activity-group's id as a `number`
 * @returns {Promise<number>} The id of the age-group of this activity-group
 */
const getAgeGroupIdFromActivityGroup = async (id) => {
  let _activityGroup;
  if (typeof id === "number") {
    // We have an id
    _activityGroup = await strapi
      .query("activity-group")
      .findOne({ id: id });
  } else {
    throw new Error(
      "Bad argument `activityGroup`, must be a number"
    );
  }

  if (_activityGroup.age_group) {
    if (typeof _activityGroup.age_group === 'number'){
      return _activityGroup.age_group;
    } else {
      return _activityGroup.age_group.id;
    }
  }

  // If this activity-group has a parent activity-group, and it has an age-group,
  // we can just return it. And because it isn't a direct relation of the current
  // activity-group, it's represented as an id (which we can return directly).
  if (_activityGroup.parent_activity_group?.age_group) {
    return _activityGroup.parent_activity_group?.age_group;
  }

  // If this activity-group has a parent activity-group, check them
  if (_activityGroup.parent_activity_group) {
    const ageGroup = await getAgeGroupIdFromActivityGroup(
      _activityGroup.parent_activity_group.id
    );

    return ageGroup;
  }

  return undefined;
};

/**
 * Get the age-group's id that is an ancestor of this activity in the content hierarchy.
 * @param {number} id The activity's id as a `number`
 * @returns {Promise<number>} The id of the age-group of this activity
 */
const getAgeGroupIdForActivity = async (id) => {
  let _activity;
  if (typeof id === "number") {
    // We have an id
    _activity = await strapi.query("activity").findOne({ id });
  } else {
    throw new Error("Bad argument `activity`, must be a number");
  }

  if (_activity.activity_group) {
    return await getAgeGroupIdFromActivityGroup(_activity.activity_group.id);
  }

  return undefined;
};

/**
 * Get the settings single type content
 * @returns Settings object
 */
const getSettings = async () => {
  return await strapi.services.settings.find();
};

module.exports = {
  getAgeGroupIdForActivity,
  getAgeGroupIdFromActivityGroup,
  isObject,
  getSettings,
};
