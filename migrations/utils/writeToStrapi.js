const {
  createOrUpdateEntry,
  findEntry,
  getExistingFiles,
  createFile,
} = require("./utils");

/**
 * All content types
 */
const contentTypes = {
  suggestion: "suggestions",
  activity: "activities",
  activityGroup: "activity-groups",
  ageGroup: "age-groups",
  activityGroupTerm: "activitygroup-terms",
  activityGroupCategory: "activity-group-categories",
  activityTerm: "activity-terms",
  activityLocation: "locations",
  activitySkillArea: "skill-areas",
  activityEducationalObjective: "educational-objectives",
  activityDuration: "durations",
  activityLeaderSkill: "leader-skills",
  activityGroupSize: "group-sizes",
  activityPreparationDuration: "durations",
  file: "file",
};

/**
 * Content types that are tags in the input data
 */
const tagTypes = [
  contentTypes.activityLocation,
  contentTypes.activitySkillArea,
  contentTypes.activityDuration,
  contentTypes.activityLeaderSkill,
  contentTypes.activityEducationalObjective,
  contentTypes.activityGroupSize,
];

const totalResult = {
  created: [],
  updated: [],
  entries: [],
  skipped: [],
};

let existingFiles = [];
let updatedTerms = [];
let updatedTags = Object.keys(contentTypes).reduce(
  (obj, curr) => ({ ...obj, [curr]: [] }),
  {}
);

const writeProgramToStrapi = async (programData, config) => {
  console.log("Writing program data to Strapi");
  if (config.testing) {
    console.log("Data limited to one ageGroup and one activityGroup");
  }
  if (config.forceUpdate) {
    console.log("Updating every entry");
  }

  existingFiles = await getExistingFiles();

  try {
    const ageGroups = config.testing
      ? programData.ageGroups.slice(0, 1)
      : config.ageGroup
      ? programData.ageGroups.filter(
          (ageGroup) => ageGroup.locales.fi.title === config.ageGroup
        )
      : programData.ageGroups;

    console.log(
      "Writing age groups:",
      ageGroups.map((x) => x.locales.fi.title)
    );

    // Age groups can be written in parallel, since they don't have affecting crossing relations
    await Promise.all(
      ageGroups.map(async (ageGroup) => await writeAgeGroup(ageGroup, config))
    );

    console.log("Created:", totalResult.created.length, "entries");
    console.log("Updated:", totalResult.updated.length, "entries");
  } catch (error) {
    throw error;
  }
};

const writeAgeGroup = async (ageGroup, config) => {
  try {
    // First write the child activity groups
    const createdActivityGroups = [];

    const activityGroups = ageGroup.activity_groups;

    for (const activityGroup of activityGroups) {
      const result = await writeActivityGroup(activityGroup, config);
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
        subactivitygroup_term: (await writeTerm(data.subtaskgroup_term, config))
          .entries[0]?.id,
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
      config.forceUpdate
    );

    updateTotalResults(result, contentTypes.ageGroup);

    return result;
  } catch (error) {
    throw error;
  }
};

const writeActivityGroup = async (activityGroup, config) => {
  try {
    const createdActivityGroups = [];

    // If this group has child activityGroups, we write this one as an activityGroupCategory, and link it to the child activityGroups.
    // The children groups are then returned so they are linked directly to the ageGroup.
    if (activityGroup.activity_groups.length) {
      const entryData = {};

      for (const [locale, data] of Object.entries(activityGroup.locales)) {
        entryData[locale] = {
          name: data.title,
          wp_guid: data.wp_guid,
          locale: data.locale,
        };
      }

      const existingEntry = await findEntry(
        contentTypes.activityGroupCategory,
        {
          wp_guid: activityGroup.wp_guid,
          _locale: "all",
        }
      );

      const result = await createOrUpdateEntry(
        contentTypes.activityGroupCategory,
        existingEntry?.id,
        entryData,
        config.forceUpdate
      );

      for (const group of activityGroup.activity_groups) {
        group.locales = Object.entries(group.locales).reduce(
          (obj, [locale, data]) => ({
            ...obj,
            [locale]: {
              ...data,
              activity_group_category: result.entries?.filter(
                (x) => x.locale === locale
              )?.[0]?.id,
            },
          }),
          {}
        );

        const _result = await writeActivityGroup(group, config);
        createdActivityGroups.push(..._result.entries);
      }

      return { entries: createdActivityGroups };
    }

    // Then write the activity group
    const entryData = {};
    for (const [locale, data] of Object.entries(activityGroup.locales)) {
      entryData[locale] = {
        title: data.title,
        ingress: data.ingress,
        content: sanitizeTextContent(data.content),
        wp_guid: data.wp_guid,
        locale: data.locale,
        mandatory: data.mandatory,
        leader_tasks: data.leader_tasks,
        activity_group_category: data.activity_group_category,
      };

      if (!config.skip.includes("subactivitygroup_term")) {
        entryData[locale].subactivitygroup_term = (
          await writeTerm(data.subtaskgroup_term, config)
        ).entries[0]?.id;
      }

      if (!config.skip.includes("activitygroup_term")) {
        entryData[locale].activitygroup_term = (
          await writeTerm(data.taskgroup_term, config)
        ).entries[0]?.id;
      }

      if (!config.skip.includes("subactivity_term")) {
        entryData[locale].subactivity_term = (
          await writeTerm(data.subtask_term, config)
        ).entries[0]?.id;
      }

      if (!config.skip.includes("files")) {
        entryData[locale].main_image = await writeFile(data.main_image);
        entryData[locale].logo = await writeFile(data.logo);
        entryData[locale].files = await writeFiles(data.files);
      }

      if (!config.skip.includes("activity")) {
        // Then write the child activities
        const createdActivities = [];

        for (const activity of activityGroup.activities) {
          const result = await writeActivity(activity, config);
          createdActivities.push(...result.entries);
        }

        entryData[locale].activities = createdActivities
          .filter((x) => x.locale === locale)
          .map((x) => x.id);
      }
    }

    const existingEntry = await findEntry(contentTypes.activityGroup, {
      wp_guid: activityGroup.wp_guid,
      _locale: "all",
    });

    const result = await createOrUpdateEntry(
      contentTypes.activityGroup,
      existingEntry?.id,
      entryData,
      config.forceUpdate
    );

    updateTotalResults(result, contentTypes.activityGroup);

    return result;
  } catch (error) {
    throw error;
  }
};

const writeActivity = async (activity, config) => {
  try {
    const entryData = {};

    for (const [locale, data] of Object.entries(activity.locales)) {
      entryData[locale] = {
        title: data.title,
        ingress: data.ingress,
        content: sanitizeTextContent(data.content),
        wp_guid: data.wp_guid,
        locale: data.locale,
        mandatory: data.mandatory,
        leader_tasks: data.leader_tasks,
      };

      if (!config.skip.includes("files")) {
        entryData[locale].main_image = await writeFile(data.main_image);
        entryData[locale].logo = await writeFile(data.logo);
        entryData[locale].files = await writeFiles(data.files);
      }

      if (!config.skip.includes("activity_term")) {
        entryData[locale].activity_term = (
          await writeTerm(data.task_term, config)
        ).entries[0]?.id;
      }

      if (!config.skip.includes("duration")) {
        entryData[locale].duration = (
          await writeTag(data.duration, config)
        ).entries[0]?.id;
      }

      if (!config.skip.includes("location")) {
        entryData[locale].locations = await WriteTags(
          data.locations,
          contentTypes.activityLocation,
          config
        );
      }

      if (!config.skip.includes("skill_area")) {
        entryData[locale].skill_areas = await WriteTags(
          data.skill_areas,
          contentTypes.activitySkillArea,
          config
        );
      }

      if (!config.skip.includes("leader_skill")) {
        entryData[locale].leader_skills = await WriteTags(
          data.leader_skills,
          contentTypes.activityLeaderSkill,
          config
        );
      }

      if (!config.skip.includes("educational_objective")) {
        entryData[locale].educational_objectives = await WriteTags(
          data.educational_objectives,
          contentTypes.activityEducationalObjective,
          config
        );
      }

      if (!config.skip.includes("group_size")) {
        entryData[locale].group_sizes = await WriteTags(
          data.group_sizes,
          contentTypes.activityGroupSize,
          config
        );
      }

      if (!config.skip.includes("preparation_duration")) {
        entryData[locale].preparation_duration = (
          await writeTag(
            data.preparation_duration,
            contentTypes.activityDuration,
            config
          )
        ).entries[0]?.id;
      }

      if (!config.skip.includes("suggestion")) {
        // Write the child suggestions
        const createdSuggestions = [];

        for (const suggestion of data.suggestions || []) {
          const result = await writeSuggestion(suggestion, config);
          createdSuggestions.push(...result.entries);
        }

        entryData[locale].suggestions = createdSuggestions.map((s) => s.id);
      }
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
      config.forceUpdate
    );

    updateTotalResults(result, contentTypes.activity);

    return result;
  } catch (error) {
    throw error;
  }
};

const WriteTags = async (tags, type, config) => {
  const results = [];

  if (!tags) return results;

  for (const tag of tags) {
    const result = await tagWriters[type](tag, config);
    const id = result.entries[0]?.id;
    if (id) {
      results.push(id);
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

const writeSuggestion = async (suggestion, config) => {
  try {
    const existingEntry = await findEntry(contentTypes.suggestion, {
      wp_guid: suggestion.wp_guid,
      _locale: "all",
    });

    if (!config.skip.includes("files")) {
      suggestion.files = await writeFiles(suggestion.files);
    }

    const data = {
      [suggestion.locale]: suggestion,
    };

    const result = await createOrUpdateEntry(
      contentTypes.suggestion,
      existingEntry?.id,
      data,
      config.forceUpdate
    );

    updateTotalResults(result, contentTypes.suggestion);

    return result;
  } catch (error) {
    throw error;
  }
};

const writeTerm = async (term, config) => {
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
      config.forceUpdate
    );

    updateTotalResults(result, contentTypes[term.type]);

    updatedTerms.push({ ...result.entries[0], type: term.type });

    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a rate-limited version of a function,
 * which allows the function to be called only once at a time.
 * @param {Function} fn Function to run
 * @returns Rate-limited function
 */
const disallowConcurrency = (fn) => {
  let inprogressPromise = Promise.resolve();

  return async (...args) => {
    await inprogressPromise;
    inprogressPromise = inprogressPromise.then(() => fn(...args));

    return inprogressPromise;
  };
};

const _writeTag = async (tag, config) => {
  if (!tag)
    return {
      entries: [],
    };

  const alreadyUpdatedTag = updatedTags[tag.type].find(
    (t) => t.slug === tag.slug && t.locale === Object.keys(tag.locales)[0]
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

    for (const lang of Object.keys(tag.locales)) {
      if (tag.locales[lang].icon) {
        tag.locales[lang].icon = await writeFile(tag.locales[lang].icon);
      }
    }

    const result = await createOrUpdateEntry(
      contentTypes[tag.type],
      existingEntry?.id,
      tag.locales,
      config.forceUpdate
    );

    updateTotalResults(result, contentTypes[tag.type]);

    updatedTags[tag.type].push(result.entries[0]);

    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Rate-limited tag writer
 */
const writeTag = disallowConcurrency(_writeTag);

/**
 * Rate-limited writers for all types of tags
 */
const tagWriters = tagTypes.reduce(
  (obj, curr) => ({ ...obj, [curr]: disallowConcurrency(_writeTag) }),
  {}
);

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
