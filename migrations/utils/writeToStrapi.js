const { createOrUpdateEntry, findEntry } = require("./utils");

const contentTypes = {
  suggestion: "suggestions",
  activity: "activities",
  activityGroup: "activity-groups",
  ageGroup: "age-groups",
  activityGroupTerm: "activitygroup-terms",
  activityTerm: "activity-terms",
  activityLocation: "activity-locations",
  activitySkillArea: "activity-skill-areas",
  activityEducationalObjective: "activity-educational-objectives",
  activityDuration: "activity-durations",
  activityLeaderSkill: "activity-leader-skills",
};

const totalResult = {
  created: [],
  updated: [],
  entries: [],
  skipped: [],
};

const writeProgramToStrapi = async (programData, forceUpdate = false, limitToOne = false) => {
  console.log("Writing program data to Strapi");
  if (limitToOne) {
    console.log("Data limited to one ageGroup and one activityGroup");
  }
  if (forceUpdate) {
    console.log("Updating every entry");
  }
  try {
    const ageGroups = limitToOne
      ? programData.ageGroups.slice(0, 1)
      : programData.ageGroups;

    for (const ageGroup of ageGroups) {
      await writeAgeGroup(ageGroup, forceUpdate, limitToOne);
    }

    console.log("Created:", totalResult.created.length, "entries");
    console.log("Updated:", totalResult.updated.length, "entries");
  } catch (error) {
    throw error;
  }
};

const writeAgeGroup = async (ageGroup, forceUpdate = false, limitToOne = false) => {
  try {
    // First write the child activity groups
    const createdActivityGroups = [];

    const activityGroups = limitToOne
      ? ageGroup.activity_groups.slice(0, 1)
      : ageGroup.activity_groups;

    for (const activityGroup of activityGroups) {
      const result = await writeActivityGroup(activityGroup, forceUpdate);
      createdActivityGroups.push(...result.entries);
    }

    const terms = {};

    for (const [locale, data] of Object.entries(ageGroup.locales)) {
      terms[locale] = {
        subactivitygroup_term: (await writeTerm(data.subtaskgroup_term, forceUpdate))
          .entries[0]?.id,
      };
    }

    // Then write the age group
    const data = Object.entries(ageGroup.locales).reduce(
      (acc, [locale, data]) => ({
        ...acc,
        [locale]: {
          ...data,
          content: sanitizeTextContent(data.content),
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
      data,
      forceUpdate,
    );

    updateTotalResults(result, contentTypes.ageGroup);

    return result;
  } catch (error) {
    throw error;
  }
};

const writeActivityGroup = async (activityGroup, forceUpdate = false) => {
  try {
    // First write the child activity groups
    const createdActivityGroups = [];

    for (const group of activityGroup.activity_groups) {
      const result = await writeActivityGroup(group, forceUpdate);
      createdActivityGroups.push(...result.entries);
    }

    // Then write the child activities
    const createdActivities = [];

    for (const activity of activityGroup.activities) {
      const result = await writeActivity(activity, forceUpdate);
      createdActivities.push(...result.entries);
    }

    const terms = {};

    for (const [locale, data] of Object.entries(activityGroup.locales)) {
      terms[locale] = {
        content: sanitizeTextContent(data.content),
        subactivitygroup_term: (await writeTerm(data.subtaskgroup_term, forceUpdate))
          .entries[0]?.id,
        activitygroup_term: (await writeTerm(data.taskgroup_term, forceUpdate)).entries[0]
          ?.id,
        subactivity_term: (await writeTerm(data.subtask_term, forceUpdate)).entries[0]?.id,
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
      data,
      forceUpdate,
    );

    updateTotalResults(result, contentTypes.activityGroup);

    return result;
  } catch (error) {
    throw error;
  }
};

const writeActivity = async (activity, forceUpdate = false) => {
  try {
    // First write the child suggestions and terms
    for (const [locale, data] of Object.entries(activity.locales)) {
      const createdSuggestions = [];

      for (const suggestion of data.suggestions || []) {
        const result = await writeSuggestion(suggestion, forceUpdate);
        createdSuggestions.push(...result.entries);
      }

      data.content = sanitizeTextContent(data.content),
      data.suggestions = createdSuggestions.map((s) => s.id);
      data.activity_term = (await writeTerm(data.task_term, forceUpdate)).entries[0]?.id;
      data.duration = (await writeTag(data.suration, forceUpdate)).entries[0]?.id;
      data.locations = await MapPromises(data.location?.map(async (x) => (await writeTag(x, forceUpdate)).entries[0]?.id));
      data.skill_areas = await MapPromises(data.skill_areas?.map(async (x) => (await writeTag(x, forceUpdate)).entries[0]?.id));
      data.leader_skills = await MapPromises(data.leader_skills?.map(async (x) => (await writeTag(x, forceUpdate)).entries[0]?.id));
      data.educational_objectives = await MapPromises(data.educational_objectives?.map(async (x) => (await writeTag(x, forceUpdate)).entries[0]?.id));
    }

    // Then write the activity
    const existingEntry = await findEntry(contentTypes.activity, {
      wp_guid: activity.wp_guid,
      _locale: "all",
    });

    const result = await createOrUpdateEntry(
      contentTypes.activity,
      existingEntry?.id,
      activity.locales,
      forceUpdate,
    );

    updateTotalResults(result, contentTypes.activity);

    return result;
  } catch (error) {
    throw error;
  }
};

const MapPromises = async (promises) => {
  const results = [];
  if (!promises) return results;

  for (const p of promises) {
    try {
      const result = await p;
      results.push(result);
    } catch (error) {
      console.error(error);
    }
  }
  return results;
}

const writeSuggestion = async (suggestion, forceUpdate = false) => {
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
      data,
      forceUpdate
    );

    updateTotalResults(result, contentTypes.suggestion)

    return result;
  } catch (error) {
    throw error;
  }
};

const writeTerm = async (term, forceUpdate = false) => {
  if (!term)
    return {
      entries: [],
    };

  try {
    const existingEntry = await findEntry(contentTypes[term.type], {
      name: term.name,
      _locale: "all",
    });

    const result = await createOrUpdateEntry(
      contentTypes[term.type],
      existingEntry?.id,
      term.locales,
      forceUpdate,
    );

    updateTotalResults(result, contentTypes[term.type]);

    return result;
  } catch (error) {
    throw error;
  }
};

const writeTag = async (tag, forceUpdate = false) => {
  if (!tag)
    return {
      entries: [],
    };

  try {
    const existingEntry = await findEntry(contentTypes[tag.type], {
      slug: tag.slug,
      _locale: "all",
    });

    const result = await createOrUpdateEntry(
      contentTypes[tag.type],
      existingEntry?.id,
      tag.locales,
      forceUpdate
    );

    updateTotalResults(result, contentTypes[tag.type]);

    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Replace line breaks with paragraphs and such
 * @param {string} text The text to sanitize
 * @returns Sanitized text
 */
const sanitizeTextContent = (text) => {
  return text?.split(/\r\n\r\n/).map((part) => `<p>${part}</p>`).join('').replace(/\r\n/g, '<br />');
}

const updateTotalResults = (result, contentType) => {
  if (result.skipped?.length) {
    console.log(
      `Skipped ${contentType || 'unknown types'}:`,
      result.skipped
    );
  }
  if (result.created?.length) {
    console.log(
      `Created ${contentType || 'unknown types'}:`,
      result.entries.map((x) => x.title || x.name)
    );
  }
  if (result.updated?.length) {
    console.log(
      `Updated ${contentType || 'unknown types'}:`,
      result.entries.map((x) => x.title || x.name)
    );
  }
  totalResult.created.push(...(result.created || []));
  totalResult.updated.push(...(result.updated || []));
  totalResult.entries.push(...(result.entries || []));
  totalResult.skipped.push(...(result.skipped || []));
};

module.exports = {
  writeProgramToStrapi,
};
