const axiosInstance = require("./utils/axios");
const { writeFileSync, readFileSync, existsSync } = require("fs");

const cachePath = "./migrations/data/data_cache.json";
const dataPath = "./migrations/data/program_data.json";

class Cache {
  disabled = false;
  cache = {};
  hits = 0;
  misses = 0;
  init(data) {
    this.cache = data;
  }
  get(url) {
    if (this.disabled) return undefined;

    if (this.cache[url]) {
      this.hits++;
      console.log(`Cache hit (${this.hits}):`, url);
      return this.cache[url];
    }

    this.misses++;
    console.log(`Cache miss (${this.misses}):`, url);
    return undefined;
  }
  set(url, data) {
    this.cache[url] = data;

    // Write cache to file on every update so we don't miss anything
    writeFileSync(cachePath, JSON.stringify(this.cache));
  }
  disable() {
    this.disabled = true;
  }
}

const cache = new Cache();

const parseList = async (items, parser) => {
  const _items = [];
  for (const item of items) {
    _items.push(await parser(item));
  }
  return _items;
};

const getData = async (url) => {
  const cachedData = cache.get(url);
  if (cachedData) {
    return cachedData;
  }

  try {
    const res = await axiosInstance.get(url);
    cache.set(url, res.data);

    return res.data;
  } catch (error) {
    throw error;
  }
};

const parseLanguageCode = (languageCode) => {
  switch (languageCode.toLowerCase()) {
    case "psm":
      return "sme";
    default:
      return languageCode.toLowerCase();
  }
};

const fetchProgram = async (programUrl) => {
  const data = await getData(programUrl);

  const program = await parseProgram(data.program[0]);

  return program;
};

const parseProgram = async (program) => {
  const data = {};
  data.ageGroups = await parseAgeGroups(program.agegroups);
  return data;
};

const parseAgeGroups = async (ageGroups) =>
  await parseList(ageGroups, parseAgeGroup);

const parseAgeGroup = async (ageGroup) => {
  const data = { locales: {} };

  for (const languageVersion of ageGroup.languages) {
    let details;
    try {
      details = await getData(languageVersion.details);
    } catch (error) {
      console.error(error);
      continue;
    }

    const correctLocale = parseLanguageCode(languageVersion.lang);

    data.wp_guid = details.guid;

    data.locales[correctLocale] = {
      MinimumAge: parseInt(details.minAge),
      MaximumAge: parseInt(details.maxAge),
      Ingress: details.ingress,
      Subtaskgroup_term: parseTerm(
        details.subtaskgroup_term,
        "activityGroupTerm",
        correctLocale
      ),
      Title: details.title,
      Content: details.content,
      wp_guid: details.guid,
      locale: correctLocale,
      Links: details.additional_content?.links?.map((link) => ({
        Description: link.description,
        Url: link.url,
      })),
      // TODO Images
    };
  }

  data.activity_groups = await parseTaskGroups(ageGroup.taskgroups);

  console.log("Parsed ageGroup", data.locales["fi"].Title);

  return data;
};

const parseTaskGroups = async (taskGroups) =>
  await parseList(taskGroups, parseTaskGroup);

const parseTaskGroup = async (taskGroup) => {
  const data = { locales: {} };

  for (const languageVersion of taskGroup.languages) {
    let details;
    try {
      details = await getData(languageVersion.details);
    } catch (error) {
      console.error(error);
      continue;
    }

    const correctLocale = parseLanguageCode(languageVersion.lang);

    data.wp_guid = details.guid;

    data.locales[correctLocale] = {
      Title: details.title,
      Ingress: details.ingress,
      Content: details.content,
      Subtaskgroup_term: parseTerm(
        details.subtaskgroup_term,
        "activityGroupTerm",
        correctLocale
      ),
      Taskgroup_term: parseTerm(
        details.taskgroup_term,
        "activityGroupTerm",
        correctLocale
      ),
      Subtask_term: parseTerm(
        details.subtask_term,
        "activityTerm",
        correctLocale
      ),
      wp_guid: details.guid,
      locale: correctLocale,
      Mandatory: details.tags?.pakollisuus[0]?.slug === "mandatory",
      // TODO Images
    };
  }

  data.activity_groups = await parseTaskGroups(taskGroup.taskgroups);
  data.activities = await parseTasks(taskGroup.tasks);

  console.log("Parsed taskGroup:", data.locales["fi"].Title);
  return data;
};

const parseTasks = async (tasks) => await parseList(tasks, parseTask);

const parseTask = async (task) => {
  const data = { locales: {} };

  for (const languageVersion of task.languages) {
    let details;
    try {
      details = await getData(languageVersion.details);
    } catch (error) {
      console.error(error);
      continue;
    }

    const correctLocale = parseLanguageCode(languageVersion.lang);

    data.wp_guid = details.guid;

    data.locales[correctLocale] = {
      Title: details.title,
      Ingress: details.ingress,
      Content: details.content,
      Task_term: parseTerm(
        details.task_term,
        "activityTerm",
        correctLocale
      ),
      wp_guid: details.guid,
      locale: correctLocale,
      Mandatory: details.tags?.pakollisuus[0]?.slug === "mandatory",
      Leader_tasks: details.leader_tasks,
      // TODO Images
      // TODO Group size
      // TODO Location
      // TODO Duration
      // TODO Preparation duration
      // TODO Level
      // TODO Links
      // TODO Skill areas
      // TODO Equipment
      // TODO Educational objectives
      // TODO Leader skills
      // TODO Theme
    };

    const languagesSuggestions = details.suggestions_details?.find(
      (s) => s.lang === languageVersion.lang.toLowerCase()
    );
    if (languagesSuggestions) {
      try {
        const suggestions = await getData(languagesSuggestions.details);
        data.locales[correctLocale].suggestions = suggestions.items?.map(
          (s) => ({
            Title: s.title,
            Content: s.content,
            Author: s.publisher?.nickname,
            wp_guid: s.guid,
            locale: correctLocale,
          })
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  console.log("Parsed task:", data.locales["fi"].Title);
  return data;
};

const parseTerm = (term, type, locale) => {
  if (term) {
    return {
      type,
      name: term.name,
      locales: {
        [locale]: {
          Name: term.name,
          Singular: term.single,
          Plural: term.plural,
        },
      },
    };
  }
  return undefined;
};

module.exports = async (config) => {
  console.log("Fetching data from old api");

  if (config.noCache) {
    console.log("Response caching disabled");
    cache.disable();
  }
  if (existsSync(cachePath)) {
    const cacheDataString = readFileSync(cachePath);

    const cacheData = JSON.parse(cacheDataString);

    cache.init(cacheData);
  }

  const data = await fetchProgram(config.programUrl);

  writeFileSync(dataPath, JSON.stringify(data, undefined, 2));
};