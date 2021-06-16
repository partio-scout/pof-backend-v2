const {
  createOrUpdateEntry,
  findEntry,
  getExistingFiles,
  createFile,
} = require("./utils");

const contentTypes = {
  suggestion: "suggestions",
  activity: "activities",
  activityGroup: "activity-groups",
  ageGroup: "age-groups",
  activityGroupTerm: "activitygroup-terms",
  activityTerm: "activity-terms",
  activityLocation: "locations",
  activitySkillArea: "skill-areas",
  activityEducationalObjective: "educational-objectives",
  activityDuration: "durations",
  activityLeaderSkill: "leader-skills",
  file: "file",
};

const totalResult = {
  created: [],
  updated: [],
  entries: [],
  skipped: [],
};

let existingFiles = [];
let updatedTerms = [];
let updatedTags = [];

const writeProgramToStrapi = async (
  programData,
  forceUpdate = false,
  limitToOne = false
) => {
  console.log("Writing program data to Strapi");
  if (limitToOne) {
    console.log("Data limited to one ageGroup and one activityGroup");
  }
  if (forceUpdate) {
    console.log("Updating every entry");
  }

  existingFiles = await getExistingFiles();

  try {
    const ageGroups = limitToOne
      ? programData.ageGroups.slice(0, 1)
      : programData.ageGroups;

    // Age groups can be written in parellel, since they don't have affecting crossing relations
    await Promise.all(
      ageGroups.map(
        async (ageGroup) =>
          await writeAgeGroup(ageGroup, forceUpdate, limitToOne)
      )
    );

    console.log("Created:", totalResult.created.length, "entries");
    console.log("Updated:", totalResult.updated.length, "entries");
  } catch (error) {
    throw error;
  }
};

const writeAgeGroup = async (
  ageGroup,
  forceUpdate = false,
  limitToOne = false
) => {
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

    // Then write the age group

    const entryData = {};

    for (const [locale, data] of Object.entries(ageGroup.locales)) {
      entryData[locale] = {
        ...data,
        content: sanitizeTextContent(data.content),
        activity_groups: createdActivityGroups
          .filter((x) => x.locale === locale)
          .map((x) => x.id),
        subactivitygroup_term: (
          await writeTerm(data.subtaskgroup_term, forceUpdate)
        ).entries[0]?.id,
        main_image: await writeFile(data.main_image),
        logo: await writeFile(data.logo),
        files: await writeFiles(data.files),
      };
    }

    const existingEntry = await findEntry(contentTypes.ageGroup, {
      wp_guid: ageGroup.wp_guid,
      _locale: Object.keys(ageGroup.locales)[0],
    });

    const result = await createOrUpdateEntry(
      contentTypes.ageGroup,
      existingEntry?.id,
      entryData,
      forceUpdate
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

    // Then write the activity group
    const entryData = {};
    for (const [locale, data] of Object.entries(activityGroup.locales)) {
      entryData[locale] = {
        ...data,
        content: sanitizeTextContent(data.content),
        activity_groups: createdActivityGroups
          .filter((x) => x.locale === locale)
          .map((x) => x.id),
        activities: createdActivities
          .filter((x) => x.locale === locale)
          .map((x) => x.id),
        subactivitygroup_term: (
          await writeTerm(data.subtaskgroup_term, forceUpdate)
        ).entries[0]?.id,
        activitygroup_term: (await writeTerm(data.taskgroup_term, forceUpdate))
          .entries[0]?.id,
        subactivity_term: (await writeTerm(data.subtask_term, forceUpdate))
          .entries[0]?.id,
        main_image: await writeFile(data.main_image),
        logo: await writeFile(data.logo),
        files: await writeFiles(data.files),
      };
    }

    const existingEntry = await findEntry(contentTypes.activityGroup, {
      wp_guid: activityGroup.wp_guid,
      _locale: "all",
    });

    const result = await createOrUpdateEntry(
      contentTypes.activityGroup,
      existingEntry?.id,
      entryData,
      forceUpdate
    );

    updateTotalResults(result, contentTypes.activityGroup);

    return result;
  } catch (error) {
    throw error;
  }
};

const writeActivity = async (activity, forceUpdate = false) => {
  try {
    const entryData = {};

    for (const [locale, data] of Object.entries(activity.locales)) {
      // Write the child suggestions and terms
      const createdSuggestions = [];

      for (const suggestion of data.suggestions || []) {
        const result = await writeSuggestion(suggestion, forceUpdate);
        createdSuggestions.push(...result.entries);
      }

      entryData[locale] = {
        ...data,
        content: sanitizeTextContent(data.content),
        suggestions: createdSuggestions.map((s) => s.id),
        activity_term: (await writeTerm(data.task_term, forceUpdate)).entries[0]
          ?.id,
        duration: (await writeTag(data.duration, forceUpdate)).entries[0]?.id,
        locations: await MapPromises(
          data.location?.map(
            async (x) => (await writeTag(x, forceUpdate)).entries[0]?.id
          )
        ),
        skill_areas: await MapPromises(
          data.skill_areas?.map(
            async (x) => (await writeTag(x, forceUpdate)).entries[0]?.id
          )
        ),
        leader_skills: await MapPromises(
          data.leader_skills?.map(
            async (x) => (await writeTag(x, forceUpdate)).entries[0]?.id
          )
        ),
        educational_objectives: await MapPromises(
          data.educational_objectives?.map(
            async (x) => (await writeTag(x, forceUpdate)).entries[0]?.id
          )
        ),
        main_image: await writeFile(data.main_image),
        logo: await writeFile(data.logo),
        files: await writeFiles(data.files),
      };
    }

    // Then write the activity
    const existingEntry = await findEntry(contentTypes.activity, {
      wp_guid: activity.wp_guid,
      _locale: "all",
    });

    const result = await createOrUpdateEntry(
      contentTypes.activity,
      existingEntry?.id,
      entryData,
      forceUpdate
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
};

const writeFile = async (fileData) => {
  let returnValue = undefined;
  if (fileData) {
    const existingFile = existingFiles.find(
      (file) => file?.name === fileData?.name
    );

    if (existingFile) {
      returnValue = existingFile.id;
      updateTotalResults(
        { skipped: [returnValue], entries: [existingFile] },
        contentTypes.file
      );
    } else {
      const newFile = await createFile(fileData.path);
      existingFiles.push(newFile);
      returnValue = newFile?.id;
      updateTotalResults(
        { created: [returnValue], entries: [newFile] },
        contentTypes.file
      );
    }
  }
  return returnValue;
};

const writeFiles = async (files) => {
  if (!files?.length) return undefined;

  const results = [];

  for (const file of files) {
    const result = await writeFile(file);
    if (result) results.push(result);
  }

  return results;
};

const writeSuggestion = async (suggestion, forceUpdate = false) => {
  try {
    const existingEntry = await findEntry(contentTypes.suggestion, {
      wp_guid: suggestion.wp_guid,
      _locale: "all",
    });

    suggestion.files = await writeFiles(suggestion.files);

    const data = {
      [suggestion.locale]: suggestion,
    };

    const result = await createOrUpdateEntry(
      contentTypes.suggestion,
      existingEntry?.id,
      data,
      forceUpdate
    );

    updateTotalResults(result, contentTypes.suggestion);

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
  const alreadyUpdatedTerm = updatedTerms.find(
    (t) =>
      t.name === term.name &&
      t.locale === Object.keys(term.locales)[0] &&
      t.type === term.type
  );
  if (alreadyUpdatedTerm)
    return {
      entries: [alreadyUpdatedTerm],
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
      forceUpdate
    );

    updateTotalResults(result, contentTypes[term.type]);

    updatedTerms.push({ ...result.entries[0], type: term.type });

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

  const alreadyUpdatedTag = updatedTags.find(
    (t) =>
      t.slug === tag.slug &&
      t.locale === Object.keys(tag.locales)[0] &&
      t.type === tag.type
  );
  if (alreadyUpdatedTag)
    return {
      entries: [alreadyUpdatedTag],
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

    updatedTags.push({ ...result.entries[0], type: tag.type });

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
  return text
    ?.split(/\r\n\r\n/)
    .map((part) => `<p>${part}</p>`)
    .join("")
    .replace(/\r\n/g, "<br />");
};

const updateTotalResults = (result, contentType) => {
  if (result.skipped?.length) {
    console.log(`Skipped ${contentType || "unknown types"}:`, result.skipped);
  }
  if (result.created?.length) {
    console.log(
      `Created ${contentType || "unknown types"}:`,
      result.entries.map((x) => x?.title || x?.name || x)
    );
  }
  if (result.updated?.length) {
    console.log(
      `Updated ${contentType || "unknown types"}:`,
      result.entries.map((x) => x?.title || x?.name || x)
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
