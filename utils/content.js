
/**
 * Checks if a value is an object
 * @param {any} value The value to test
 * @returns {boolean}
 */
const isObject = (value) =>
  Object.prototype.toString.call(value) === "[object Object]";

/**
 * Get the age-groups that are ancestors of this activity-group in the content hierarchy.
 * @param {any} activityGroup The activity-group as an `object` or it's id as a `number`
 * @returns {Object[]} The age-groups of this activity-group
 */
const getAgeGroupsFromActivityGroup = async (activityGroup) => {
  let _activityGroup;
  if (typeof activityGroup === "number") {
    // We have an id
    _activityGroup = await strapi
      .query("activity-group")
      .findOne({ id: activityGroup });
  } else if (isObject(activityGroup)) {
    // We have the entry
    _activityGroup = activityGroup;
  } else {
    throw new Error(
      "Bad argument `activityGroup`, must be an object or a number"
    );
  }

  // If this activity-group has activity-groups, we can just check them directly
  if (_activityGroup.activity_groups?.length) {
    const ageGroups = [];
    for (const group of _activityGroup.activity_groups) {
      const g = await getAgeGroupsFromActivityGroup(group);
      if (g) ageGroups.push(g);
    }
    return ageGroups;
  }

  return _activityGroup.age_group ? [_activityGroup.age_group] : [];
};

/**
 * Get the age-groups that are ancestors of this activity in the content hierarchy.
 * @param {any} activity The activity as an `object` or it's id as a `number`
 * @returns {Object[]} The age-groups of this activity
 */
const getAgeGroupForActivity = async (activity) => {
  let _activity;
  if (typeof activity === "number") {
    // We have an id
    _activity = await strapi.query("activity").findOne({ id: activity });
  } else if (isObject(activity)) {
    // We have the entry
    _activity = activity;
  } else {
    throw new Error("Bad argument `activity`, must be an object or a number");
  }

  const ageGroups = [];
  for (const group of activity.activity_groups || []) {
    const g = await getAgeGroupsFromActivityGroup(group);
    if (g) ageGroups.push(...g);
  }

  return ageGroups;
};

module.exports = {
  getAgeGroupForActivity,
  getAgeGroupsFromActivityGroup,
};
