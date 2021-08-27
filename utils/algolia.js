const cleanDeep = require("clean-deep");

/**
 * Index/delete one entry in Algolia
 * @param {string} contentType Type of the entry
 * @param {Object} data Entry data
 * @param {boolean} draftMode To use draft mode or not (default `true`)
 */
const updateInAlgolia = async (contentType, data, draftMode = true) => {
  if (draftMode) {
    if (data.published_at && isSaveable(contentType, data)) {
      await saveToAlgolia(contentType, data);
    } else {
      await deleteFromAlgolia(contentType, data.id);
    }
  } else {
    if (isSaveable(contentType, data)) {
      await saveToAlgolia(contentType, data);
    } else {
      await deleteFromAlgolia(contentType, data.id);
    }
  }
};

/**
 * Check if it's safe to save the content in Algolia
 * @param {string} contentType
 * @param {Object} data
 * @returns {boolean}
 */
const isSaveable = (contentType, data) => {
  switch (contentType) {
    case "activity":
      return data.activity_group !== null;
    case "activity-group":
      return data.age_group !== null;
    default:
      return true;
  }
};

/**
 * Save an entry to Algolia
 * @param {string} contentType Type of the entry
 * @param {Object} data Entry's data
 */
const saveToAlgolia = async (contentType, data) => {
  if (process.env.NODE_ENV === "test" || !strapi.services.algolia) return;

  const sanitizedData = sanitizeData(data);

  await strapi.services.algolia.saveObject(sanitizedData, contentType);
};

/**
 * Delete an entry from Algolia
 * @param {string} contentType Type of the entry
 * @param {string} id Entry's id
 */
const deleteFromAlgolia = async (contentType, id) => {
  if (process.env.NODE_ENV === "test" || !strapi.services.algolia) return;

  await strapi.services.algolia.deleteObject(id, contentType);
};

/**
 * Remove stuff we don't want to index from the data
 * @param {Object} data The entry
 * @returns Clean entry data
 */
const sanitizeData = (data) => {
  return cleanDeep(data, {
    cleanKeys: ["created_by", "updated_by"],
  });
};

/**
 * Create premade lifecycle hooks that send content to Algolia.
 * @param {string} contentType The content type's name
 * @returns An object with premade lifecycle hooks that send content to Algolia
 */
const createLifecycleHooks = (contentType) => ({
  afterUpdate(result) {
    updateInAlgolia(contentType, result);
  },
  afterDelete(result) {
    deleteFromAlgolia(contentType, result.id);
  },
});

module.exports = {
  updateInAlgolia,
  deleteFromAlgolia,
  createLifecycleHooks,
};
