const cleanDeep = require('clean-deep');

/**
 * Index/delete one entry in Algolia
 * @param {string} contentType Type of the entry
 * @param {Object} data Entry data
 * @param {boolean} draftMode To use draft mode or not (default `true`)
 */
 const updateInAlgolia = (contentType, data, draftMode = true) => {
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
  strapi.services.algolia.deleteObject(id, contentType);
}

/**
 * Remove stuff we don't want to index from the data
 * @param {Object} data The entry
 * @returns Clean entry data
 */
 const sanitizeData = (data) => {
   return cleanDeep(data, {
     cleanKeys: ['created_by', 'updated_by']
   });
};

module.exports = {
  updateInAlgolia,
  deleteFromAlgolia,
}