const { createOrUpdateEntry, findEntry } = require("./utils");

const contentTypes = {
  suggestion: "suggestions",
  activity: "activities",
  activityGroup: "activity-groups",
  ageGroup: "age-groups",
  activityGroupTerm: "activitygroup-terms",
  activityTerm: "activity-terms",
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

    const terms = {};

    for (const [locale, data] of Object.entries(ageGroup.locales)) {
      terms[locale] = {
        subactivitygroup_term: (await writeTerm(data.Subtaskgroup_term))
          .entries[0]?.id,
      };
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
          subactivitygroup_term: terms[locale].subactivitygroup_term,
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

    updateTotalResults(result, contentTypes.ageGroup);

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

    const terms = {};

    for (const [locale, data] of Object.entries(activityGroup.locales)) {
      terms[locale] = {
        subactivitygroup_term: (await writeTerm(data.Subtaskgroup_term))
          .entries[0]?.id,
        activitygroup_term: (await writeTerm(data.Taskgroup_term)).entries[0]
          ?.id,
        subactivity_term: (await writeTerm(data.Subtask_term)).entries[0]?.id,
      };
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
          subactivitygroup_term: terms[locale].subactivitygroup_term,
          activitygroup_term: terms[locale].activitygroup_term,
          subactivity_term: terms[locale].subactivity_term,
        },
      }),
      {}
    );

    const existingEntry = await findEntry(contentTypes.activityGroup, {
      wp_guid: activityGroup.wp_guid,
      _locale: "all",
    });

    const result = await createOrUpdateEntry(
      contentTypes.activityGroup,
      existingEntry?.id,
      data
    );

    updateTotalResults(result, contentTypes.activityGroup);

    return result;
  } catch (error) {
    throw error;
  }
};

const writeActivity = async (activity) => {
  try {
    // First write the child suggestions and terms
    for (const [locale, data] of Object.entries(activity.locales)) {
      const createdSuggestions = [];
      const createdTerms = [];

      for (const suggestion of data.suggestions || []) {
        const result = await writeSuggestion(suggestion);
        createdSuggestions.push(...result.entries);
      }

      data.suggestions = createdSuggestions.map((s) => s.id);

      const result = await writeTerm(data.Task_term);

      data.activity_term = result.entries[0].id;
    }

    // Then write the activity
    const existingEntry = await findEntry(contentTypes.activity, {
      wp_guid: activity.wp_guid,
      _locale: "all",
    });

    const result = await createOrUpdateEntry(
      contentTypes.activity,
      existingEntry?.id,
      activity.locales
    );

    updateTotalResults(result, contentTypes.activity);

    return result;
  } catch (error) {
    throw error;
  }
};

const writeSuggestion = async (suggestion) => {
  try {
    const existingEntry = await findEntry(contentTypes.suggestion, {
      wp_guid: suggestion.wp_guid,
      _locale: "all",
    });

    const data = {
      [suggestion.locale]: suggestion,
    };

    const result = await createOrUpdateEntry(
      contentTypes.suggestion,
      existingEntry?.id,
      data
    );

    updateTotalResults(result, contentTypes.suggestion)

    return result;
  } catch (error) {
    throw error;
  }
};

const writeTerm = async (term) => {
  if (!term)
    return {
      entries: [],
    };

  try {
    const existingEntry = await findEntry(contentTypes[term.type], {
      Name: term.name,
      _locale: "all",
    });

    const result = await createOrUpdateEntry(
      contentTypes[term.type],
      existingEntry?.id,
      term.locales
    );

    updateTotalResults(result, contentTypes[term.type]);

    return result;
  } catch (error) {
    throw error;
  }
};

const updateTotalResults = (result, contentType) => {
  if (result.created?.length) {
    console.log(
      `Created ${contentType || 'unknown types'}:`,
      result.entries.map((x) => x.Title || x.Name)
    );
  }
  if (result.updated?.length) {
    console.log(
      `Updated ${contentType || 'unknown types'}:`,
      result.entries.map((x) => x.Title || x.Name)
    );
  }
  totalResult.created.push(...(result.created || []));
  totalResult.updated.push(...(result.updated || []));
  totalResult.entries.push(...(result.entries || []));
};

module.exports = {
  writeProgramToStrapi,
};
