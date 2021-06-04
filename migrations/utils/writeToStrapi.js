const { createOrUpdateEntry, findEntry } = require("./utils");

const contentTypes = {
  suggestion: "suggestions",
  activity: "activities",
  activityGroup: "activity-groups",
  ageGroup: "age-groups",
};

const totalResult = {
  created: [],
  updated: [],
  entries: [],
};

const writeProgramToStrapi = async (programData, limitToOne = false) => {
  console.log("Writing program data to Strapi");
  if (limitToOne) {
    console.log("Data limited to one ageGroup and one activityGroup");
  }
  try {
    const ageGroups = limitToOne
      ? programData.ageGroups.slice(0, 1)
      : programData.ageGroups;

    for (const ageGroup of ageGroups) {
      await writeAgeGroup(ageGroup, limitToOne);
    }

    console.log("Created:", totalResult.created.length, "entries");
    console.log("Updated:", totalResult.updated.length, "entries");
  } catch (error) {
    throw error;
  }
};

const writeAgeGroup = async (ageGroup, limitToOne = false) => {
  try {
    // First write the child activity groups
    const createdActivityGroups = [];

    const activityGroups = limitToOne
      ? ageGroup.activity_groups.slice(0, 1)
      : ageGroup.activity_groups;

    for (const activityGroup of activityGroups) {
      const result = await writeActivityGroup(activityGroup);
      createdActivityGroups.push(...result.entries);
    }

    // Then write the age group
    const data = Object.entries(ageGroup.locales).reduce(
      (acc, [locale, data]) => ({
        ...acc,
        [locale]: {
          ...data,
          activity_groups: createdActivityGroups
            .filter((x) => x.locale === locale)
            .map((x) => x.id),
        },
      }),
      {}
    );

    const existingEntry = await findEntry(contentTypes.ageGroup, {
      wp_guid: ageGroup.wp_guid,
      _locale: Object.keys(ageGroup.locales)[0],
    });

    const result = await createOrUpdateEntry(
      contentTypes.ageGroup,
      existingEntry?.id,
      data
    );

    updateTotalResults(result);

    return result;
  } catch (error) {
    throw error;
  }
};

const writeActivityGroup = async (activityGroup) => {
  try {
    // First write the child activity groups
    const createdActivityGroups = [];

    for (const group of activityGroup.activity_groups) {
      const result = await writeActivityGroup(group);
      createdActivityGroups.push(...result.entries);
    }

    // Then write the child activities
    const createdActivities = [];

    for (const activity of activityGroup.activities) {
      const result = await writeActivity(activity);
      createdActivities.push(...result.entries);
    }

    // Then write the activity group
    const data = Object.entries(activityGroup.locales).reduce(
      (acc, [locale, data]) => ({
        ...acc,
        [locale]: {
          ...data,
          activity_groups: createdActivityGroups
            .filter((x) => x.locale === locale)
            .map((x) => x.id),
          activities: createdActivities
            .filter((x) => x.locale === locale)
            .map((x) => x.id),
        },
      }),
      {}
    );

    const existingEntry = await findEntry(contentTypes.activityGroup, {
      wp_guid: activityGroup.wp_guid,
      _locale: 'all',
    });

    const result = await createOrUpdateEntry(
      contentTypes.activityGroup,
      existingEntry?.id,
      data
    );

    updateTotalResults(result);

    return result;
  } catch (error) {
    throw error;
  }
};

const writeActivity = async (activity) => {
  try {
    // First write the child suggestions
    for (const [locale, data] of Object.entries(activity.locales)) {
      const createdSuggestions = [];

      for (const suggestion of data.suggestions || []) {
        const result = await writeSuggestion(suggestion);
        createdSuggestions.push(...result.entries);
        updateTotalResults(result);
      }

      data.suggestions = createdSuggestions.map((s) => s.id);
    }

    // Then write the activity
    const existingEntry = await findEntry(contentTypes.activity, {
      wp_guid: activity.wp_guid,
      _locale: 'all',
    });

    const result = await createOrUpdateEntry(
      contentTypes.activity,
      existingEntry?.id,
      activity.locales
    );

    updateTotalResults(result);

    return result;
  } catch (error) {
    throw error;
  }
};

const writeSuggestion = async (suggestion) => {
  try {
    const existingEntry = await findEntry(contentTypes.suggestion, {
      wp_guid: suggestion.wp_guid,
      _locale: 'all',
    });

    const data = {
      [suggestion.locale]: suggestion,
    };

    const result = await createOrUpdateEntry(
      contentTypes.suggestion,
      existingEntry?.id,
      data
    );

    return result;
  } catch (error) {
    throw error;
  }
};

const updateTotalResults = (result) => {
  if (result.created?.length) {
    console.log(
      "Created entries:",
      result.entries.map((x) => x.Title)
    );
  }
  if (result.updated?.length) {
    console.log(
      "Updated entries:",
      result.entries.map((x) => x.Title)
    );
  }
  totalResult.created.push(...(result.created || []));
  totalResult.updated.push(...(result.updated || []));
  totalResult.entries.push(...(result.entries || []));
};

module.exports = {
  writeProgramToStrapi,
};
