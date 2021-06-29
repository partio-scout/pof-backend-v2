const cleanDeep = require("clean-deep");

/**
 * Index/delete one entry in Algolia
 * @param {string} contentType Type of the entry
 * @param {Object} data Entry data
 * @param {boolean} draftMode To use draft mode or not (default `true`)
 */
const updateInAlgolia = (contentType, data, draftMode = true) => {
  if (process.env.NODE_ENV === "test") return;

  const sanitizedData = sanitizeData(data);

  if (draftMode) {
    if (data.published_at) {
      strapi.services.algolia.saveObject(sanitizedData, contentType);
    } else {
      deleteFromAlgolia(sanitizedData.id, contentType);
    }
  } else {
    strapi.services.algolia.saveObject(sanitizedData, contentType);
  }
};

/**
 * Delete an entry from Algolia
 * @param {string} contentType Type of the entry
 * @param {string} id Entry's id
 */
const deleteFromAlgolia = (contentType, id) => {
  if (process.env.NODE_ENV === "test") return;

  strapi.services.algolia.deleteObject(id, contentType);
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
