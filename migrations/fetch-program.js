const { rateLimited: axiosInstance } = require("./utils/axios");
const {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  createWriteStream,
} = require("fs");
const { resolve: resolvePath } = require("path");
const needle = require("needle");

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
    if (this.disabled) {
      console.log("Cache skip", url);
      return undefined;
    }

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
      minimum_age: parseInt(details.minAge),
      maximum_age: parseInt(details.maxAge),
      ingress: details.ingress,
      subtaskgroup_term: parseTerm(
        details.subtaskgroup_term,
        "activityGroupTerm",
        correctLocale
      ),
      title: details.title,
      content: details.content,
      wp_guid: details.guid,
      locale: correctLocale,
      links: parseLinks(details.additional_content?.links),
      main_image: await parseFile(details.images?.main_image),
      logo: await parseFile(details.images?.logo),
      files: await parseFiles(details.additional_content?.files),
    };
  }

  data.activity_groups = await parseTaskGroups(ageGroup.taskgroups);

  console.log("Parsed ageGroup", data.locales["fi"].title);

  return data;
};

const parseLinks = (links) =>
  links?.map((link) => ({
    description: link.description,
    url: link.url,
  }));

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
      title: details.title,
      ingress: details.ingress,
      content: details.content,
      subtaskgroup_term: parseTerm(
        details.subtaskgroup_term,
        "activityGroupTerm",
        correctLocale
      ),
      taskgroup_term: parseTerm(
        details.taskgroup_term,
        "activityGroupTerm",
        correctLocale
      ),
      subtask_term: parseTerm(
        details.subtask_term,
        "activityTerm",
        correctLocale
      ),
      links: parseLinks(details.additional_content?.links),
      wp_guid: details.guid,
      locale: correctLocale,
      mandatory: details.tags?.pakollisuus[0]?.slug === "mandatory",
      main_image: await parseFile(details.images?.main_image),
      logo: await parseFile(details.images?.logo),
      files: await parseFiles(details.additional_content?.files),
    };
  }

  data.activity_groups = await parseTaskGroups(taskGroup.taskgroups);
  data.activities = await parseTasks(taskGroup.tasks);

  console.log("Parsed taskGroup:", data.locales["fi"].title);
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
      title: details.title,
      ingress: details.ingress,
      content: details.content,
      task_term: parseTerm(details.task_term, "activityTerm", correctLocale),
      wp_guid: details.guid,
      locale: correctLocale,
      mandatory: details.tags?.pakollisuus[0]?.slug === "mandatory",
      leader_tasks: details.leader_tasks,
      group_sizes: await parseTags(
        details.tags?.ryhmakoko,
        "activityGroupSize",
        correctLocale
      ),
      locations: await parseTags(
        details.tags?.paikka,
        "activityLocation",
        correctLocale
      ),
      duration: await parseTag(
        details.tags?.suoritus_kesto,
        "activityDuration",
        correctLocale
      ),
      links: parseLinks(details.additional_content?.links),
      skill_areas: await parseTags(
        details.tags?.taitoalueet,
        "activitySkillArea",
        correctLocale
      ),
      leader_skills: await parseTags(
        details.tags?.johtamistaito,
        "activityLeaderSkill",
        correctLocale
      ),
      educational_objectives: await parseTags(
        details.tags?.kasvatustavoitteet,
        "activityEducationalObjective",
        correctLocale
      ),
      preparation_duration: await parseTag(
        details.tags?.suoritus_valmistelu_kesto,
        "activityPreparationDuration",
        correctLocale
      ),
      main_image: await parseFile(details.images?.main_image),
      logo: await parseFile(details.images?.logo),
      files: await parseFiles(details.additional_content?.files),
    };

    const languagesSuggestions = details.suggestions_details?.find(
      (s) => s.lang === languageVersion.lang.toLowerCase()
    );
    if (languagesSuggestions) {
      try {
        const suggestions = await getData(languagesSuggestions.details);
        data.locales[correctLocale].suggestions = await Promise.all(
          suggestions.items?.map(async (s) => ({
            title: s.title,
            content: s.content,
            author: s.publisher?.nickname,
            wp_guid: s.guid,
            locale: correctLocale,
            files: await parseFiles(s.additional_content?.files),
            links: parseLinks(s.additional_content?.links),
          }))
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  console.log("Parsed task:", data.locales["fi"].title);
  return data;
};

const parseTerm = (term, type, locale) => {
  if (term) {
    return {
      type,
      name: term.name,
      locales: {
        [locale]: {
          name: term.name,
          singular: term.single,
          plural: term.plural,
        },
      },
    };
  }
  return undefined;
};

const parseTags = async (tags, type, locale) => {
  if (!tags) return undefined;

  const results = [];
  for (const tag of tags) {
    const result = await parseTag(tag, type, locale);
    results.push(result);
  }

  return results;
};

const parseTag = async (tag, type, locale) => {
  if (!tag) {
    return undefined;
  }

  const slug = parseTagSlug(tag.slug || tag.name, type);

  const data = {
    type,
    slug: slug,
    locales: {
      [locale]: {
        name: parseTagName(tag.name, type),
        slug: slug,
      },
    },
  };

  if (tag.icon) {
    data.locales[locale].icon = await parseFile({ url: tag.icon });
  }

  return data;
};

const parseTagName = (name, type) => {
  switch (type) {
    case "activityPreparationDuration":
      return `${name} min`;
    default:
      return name;
  }
};

const parseLocationSlug = (slug) => {
  if (!slug) return undefined;

  if (slug.startsWith("A_")) {
    return slug.slice(2).toLowerCase();
  }
  switch (slug) {
    case "other":
      return "muu";
    case "metsä":
      return "metsässä";
    case "kolo":
      return "kololla";
    case "meeting_place":
      return "kololla";
    default:
      return slug.toLowerCase();
  }
};

const parseDurationSlug = (slug) => {
  let _slug = slug;
  if (_slug.startsWith("A_")) {
    _slug = _slug.slice(2).replace(/_/g, " ").toLowerCase();
  }
  const timeRangeResult = /^(\d+)(-\d+)?(min|h)?$/.exec(_slug);
  if (timeRangeResult !== null) {
    _slug = `${timeRangeResult[1]}${timeRangeResult[2] || ""} ${
      timeRangeResult[3] || "min"
    }`;
  }

  switch (_slug) {
    case "120 min":
      return "2 tuntia";
    case "90 min":
      return "1,5 tuntia";
    default:
      return _slug;
  }
};

const parseTagSlug = (slug, type) => {
  switch (type) {
    case "activityLocation":
      return parseLocationSlug(slug);
    case "activityDuration":
      return parseDurationSlug(slug);
    case "activityPreparationDuration":
      return `${slug} min`;
    default:
      return slug.toLowerCase();
  }
};

const parseFiles = async (files) => {
  if (!files?.length) return undefined;

  const results = [];

  for (const file of files) {
    try {
      const result = await parseFile(file);
      results.push(result);
    } catch (error) {
      console.error(error);
    }
  }

  return results;
};

const parseFile = async (file) => {
  if (!file?.url) return undefined;

  return await downloadFile(file.url, file.mime_type, file.description);
};

const downloadFile = async (url, mime_type, description) => {
  const cachedData = cache.get(url);
  if (cachedData) {
    return cachedData;
  }

  const directoryPath = resolvePath(__dirname, "./data/images");

  if (!existsSync(directoryPath)) {
    mkdirSync(directoryPath, { recursive: true });
  }

  const fileName = url.split("/").pop();

  const filePath = resolvePath(directoryPath, fileName);

  const writer = createWriteStream(filePath);

  try {
    await new Promise((resolve, reject) => {
      needle
        .get(encodeURI(url))
        .pipe(writer)
        .on("ready", (data) => {
          resolve(data);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  } catch (err) {
    console.error(err);
    throw error;
  }

  const data = {
    name: fileName,
    mime_type,
    path: filePath,
    description,
  };

  cache.set(url, data);

  return data;
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
