const cleanDeep = require("clean-deep");
const pick = require("lodash/pick");

/**
 * Index/delete one entry in Algolia
 * @param {string} contentType Type of the entry
 * @param {Object} data Entry data
 * @param {boolean} draftMode To use draft mode or not (default `true`)
 */
const updateInAlgolia = async (contentType, data, draftMode = true) => {
  if (process.env.NODE_ENV === "test" || !strapi.services.algolia) return;

  if (draftMode) {
    if (data.published_at && (await isSaveable(contentType, data))) {
      await saveToAlgolia(contentType, data);
    } else {
      await deleteFromAlgolia(contentType, data.id);
    }
  } else {
    if (await isSaveable(contentType, data)) {
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
 * @returns {Promise<boolean>}
 */
const isSaveable = async (contentType, data) => {
  switch (contentType) {
    case "activity":
      return (
        (await isRelationPublished(data.activity_group, "activity-group")) &&
        (await isRelationPublished(data.age_group, "age-group"))
      );
    case "activity-group":
      return await isRelationPublished(data.age_group, "age-group");
    case "suggestion":
      return await isRelationPublished(data.activity?.age_group, "age-group");
    case "content-page":
      return await isContentPageSaveable(data);
    default:
      return true;
  }
};

const contentPageIsInNavigation = (page, navigation) => {
  for (const navigationItem of navigation) {
    if (navigationItem.page?.id === page.id) return true;
    if (navigationItem.subnavigation && contentPageIsInNavigation(page, navigationItem.subnavigation)) return true;
  }
  return false;
}

/**
 * Check if a ContentPage is in FrontPage's navigation
 * @param {Object} contentPage The page
 * @returns {Promise<boolean>}
 */
const isContentPageSaveable = async (contentPage) => {
  const frontPage = await strapi.services['front-page'].find({ _locale: contentPage.locale });

  if (!frontPage) return false;

  const navigation = frontPage.navigation || [];

  return contentPageIsInNavigation(contentPage, navigation);
}

/**
 * Checks if a relation is published
 * @param {number | object | undefined | null} relation
 * @returns {Promise<boolean>}
 */
const isRelationPublished = async (relation, contentType) => {
  if (relation == null || relation === undefined) return false;

  if (typeof relation === "number") {
    try {
      let entity = await strapi.services[contentType].findOne({ id: relation });

      // If no entity is returned, it is not published
      if (!entity) return false;

      return await isRelationPublished(entity);
    } catch (error) {
      console.error(error);
    }
  }

  if (!relation?.id || !relation?.published_at) return false;

  return true;
};

/**
 * Save an entry to Algolia
 * @param {string} contentType Type of the entry
 * @param {Object} data Entry's data
 */
const saveToAlgolia = async (contentType, data) => {
  const sanitizedData = sanitizeData(contentType, data);
  const augmentedData = await augmentData(contentType, sanitizedData);

  await strapi.services.algolia.saveObject(augmentedData, contentType);
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
 * @param {string} contentType The name of the content type
 * @param {Object} data The entry
 * @returns Clean entry data
 */
const sanitizeData = (contentType, data) => {
  let cleanedData = cleanDeep(data, {
    cleanKeys: ["created_by", "updated_by"],
  });

  switch (contentType) {
    case "activity-group":
      return sanitizeActivityGroup(cleanedData);

    default:
      return cleanedData;
  }
};

/**
 * Add properties to the indexed data
 * @param {string} contentType The name of the content type
 * @param {Object} data The entry
 * @returns Augmented data
 */
const augmentData = async (contentType, data) => {
  switch (contentType) {
    case "suggestion": {
      if (!data.activity?.age_group) return data;

      const ageGroup = await strapi.services["age-group"].findOne({
        id: data.activity.age_group,
      });

      if (ageGroup) {
        data.age_group = {
          id: ageGroup.id,
          title: ageGroup.title,
        };
      }
      return data;
    }
    default:
      return data;
  }
};

const sanitizeActivityGroup = (data) => {
  return {
    ...data,
    // Get only id and title from activities, because otherwise there's too much data for Algolia
    activities: data.activities?.map((x) => pick(x, ["id", "title"])) || [],
  };
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
  isRelationPublished,
  sanitizeData,
  sanitizeActivityGroup,
};
