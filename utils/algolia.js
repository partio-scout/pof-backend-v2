const cleanDeep = require("clean-deep");

/**
 * Index/delete one entry in Algolia
 * @param {string} contentType Type of the entry
 * @param {Object} data Entry data
 * @param {boolean} draftMode To use draft mode or not (default `true`)
 */
const updateInAlgolia = async (contentType, data, draftMode = true) => {
  const sanitizedData = sanitizeData(data);

  if (draftMode) {
    if (data.published_at) {
      await strapi.services.algolia.saveObject(sanitizedData, contentType);
    } else {
      await deleteFromAlgolia(sanitizedData.id, contentType);
    }
  } else {
    await strapi.services.algolia.saveObject(sanitizedData, contentType);
  }
};

/**
 * Delete an entry from Algolia
 * @param {string} contentType Type of the entry
 * @param {string} id Entry's id
 */
const deleteFromAlgolia = async (contentType, id) => {
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
