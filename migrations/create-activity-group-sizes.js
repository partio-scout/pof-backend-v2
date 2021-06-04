const { createOrUpdateEntry, findEntry } = require("./utils/utils");

const data = [
  {
    fi: { name: "Yksin" },
    "sv-FI": { name: "Ensam" },
  },
  {
    fi: { name: "Kaksin" },
    "sv-FI": { name: "Parvis" },
  },
  {
    fi: { name: "Muutama" },
    "sv-FI": { name: "Några" },
  },
  {
    fi: { name: "Laumassa tai vartiossa" },
    "sv-FI": { name: "Grupp" },
  },
  {
    fi: { name: "Isommassa porukassa" },
    "sv-FI": { name: "Stor grupp" },
  },
  {
    fi: { name: "Muu" },
    "sv-FI": { name: "Annan" },
  },
];

const contentType = "activity-group-size";

module.exports = async () => {
  const created = [];
  const updated = [];

  for (const size of data) {
    const entry = await findEntry(contentType, { name: size['fi'].name });

    const result = await createOrUpdateEntry(contentType, entry?.id, size);
    updated.push(result.updated);
    created.push(result.created);
  }
  console.log('Created:', created);
  console.log('Updated:', updated);
};
