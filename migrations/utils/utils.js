const FormData = require("form-data");
const  { createReadStream } = require('fs');
const { fast: axiosInstance } = require("./axios");

const createOrUpdateEntry = async (
  contentType,
  id,
  data,
  forceUpdate = false
) => {
  try {
    const existing = id === undefined ? null : await getEntry(contentType, id);

    const created = [];
    const updated = [];
    const skipped = [];

    // No existing content
    if (existing === null) {
      const createdLocales = await createEntryWithLocales(contentType, data);
      created.push(...createdLocales);
      return {
        created: created.map((x) => x.id),
        entries: created.concat(updated),
      };
    }

    for (const loc in data) {
      // The locale exists
      if (existing[loc]) {
        if (forceUpdate) {
          const updatedLocale = await updateEntry(
            contentType,
            existing[loc].id,
            data[loc]
          );
          updated.push(updatedLocale);
        } else {
          skipped.push(existing[loc]);
        }
      } else {
        // The locale doesn't exist
        const createdLocale = await createLocalization(
          contentType,
          existing[Object.keys(existing)[0]].id, // problem
          loc,
          data[loc]
        );
        created.push(createdLocale);
      }
    }

    return {
      created: created.map((x) => x.id),
      updated: updated.map((x) => x.id),
      entries: [...created, ...updated, ...skipped],
      skipped: skipped.map((x) => x.id),
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Create entries for all locales
 * @param {string} contentType
 * @param {Object} data Content for all locales
 */
const createEntryWithLocales = async (contentType, data) => {
  try {
    const locales = Object.entries(data);

    const initialEntryData = locales.shift();

    const createdLocales = [];

    // Underscore as a locale means that the entry is not localized
    const initialLocale =
      initialEntryData[0] === "_" ? undefined : initialEntryData[0];

    // Create the initial entry
    const initialEntry = await createDefaultLocalization(
      contentType,
      initialLocale,
      initialEntryData[1]
    );

    createdLocales.push(initialEntry);

    // Create the other locales, linking them to the initial one
    for (const loc of locales) {
      const createdLocale = await createLocalization(
        contentType,
        initialEntry.id,
        loc[0],
        loc[1]
      );
      createdLocales.push(createdLocale);
    }

    return createdLocales;
  } catch (error) {
    throw error;
  }
};

const createDefaultLocalization = async (contentType, locale, data) => {
  try {
    const response = await axiosInstance.post(`/${contentType}`, {
      locale,
      ...data,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createLocalization = async (
  contentType,
  parentLocaleId,
  locale,
  data
) => {
  try {
    const response = await axiosInstance.post(
      `/${contentType}/${parentLocaleId}/localizations`,
      {
        locale,
        ...data,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateEntry = async (contentType, id, data) => {
  try {
    const response = await axiosInstance.put(`/${contentType}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getEntry = async (contentType, id) => {
  let data = {};

  try {
    const response = await axiosInstance.get(`/${contentType}/${id}`);
    const entry = response.data;

    if (!entry) return null;

    if (!entry.locale) {
      data["_"] = entry;
      return data;
    }

    const { localizations, ...entryData } = entry;
    data[entry.locale] = entryData;

    // If there are localizations, fetch them also
    if (localizations?.length > 0) {
      for (const locale of localizations) {
        const response = await axiosInstance.get(
          `/${contentType}/${locale.id}`
        );
        const { localizations, ...rest } = response.data;

        data[locale.locale] = rest;
      }
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findEntry = async (contentType, params) => {
  try {
    const response = await axiosInstance.get(`/${contentType}`, {
      params,
    });
    return response.data[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getExistingFiles = async () => {
  try {
    const { data } = await axiosInstance.get("/upload/files");

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const createFile = async (filePath) => {
  try {
    const formData = new FormData();

    formData.append(`files`, createReadStream(filePath));

    const { data } = await axiosInstance.post("/upload", formData, {
      // You need to use `getHeaders()` in Node.js because Axios doesn't
      // automatically set the multipart form boundary in Node.
      headers: formData.getHeaders(),
    });

    return data[0];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

module.exports = {
  createOrUpdateEntry,
  findEntry,
  getExistingFiles,
  createFile,
};
