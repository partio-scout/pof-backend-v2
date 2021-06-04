const { findEntry, createOrUpdateEntry } = require("./utils/utils");

const data = [
  { fi: { name: "Kämpällä" }, "sv-FI": { name: "På stugan" } },
  { fi: { name: "Kololla" }, "sv-FI": { name: "På kårlokalen" } },
  { fi: { name: "Kotona" }, "sv-FI": { name: "Hemma" } },
  { fi: { name: "Metsässä" }, "sv-FI": { name: "I skogen" } },
  { fi: { name: "Ulkona" }, "sv-FI": { name: "Utomhus" } },
  { fi: { name: "Vesillä" }, "sv-FI": { name: "På sjön" } },
  { fi: { name: "Vierailukohteessa" }, "sv-FI": { name: "På besök" } },
  { fi: { name: "Leiri" }, "sv-FI": { name: "Läger" } },
  { fi: { name: "Retki" }, "sv-FI": { name: "Utfärd" } },
  {
    fi: { name: "Ikäkausitapaaminen" },
    "sv-FI": { name: "Åldersgruppsträff" },
  },
  { fi: { name: "Kämppä" }, "sv-FI": { name: "Stuga" } },
  { fi: { name: "Kaupunki" }, "sv-FI": { name: "Stad" } },
  { fi: { name: "Keittiö" }, "sv-FI": { name: "Kök" } },
  { fi: { name: "Kolo" }, "sv-FI": { name: "Kårlokal" } },
  { fi: { name: "Koti" }, "sv-FI": { name: "Hemma" } },
  { fi: { name: "Majakka" }, "sv-FI": { name: "Fyr" } },
  { fi: { name: "Muu" }, "sv-FI": { name: "Annan" } },
  { fi: { name: "Metsä" }, "sv-FI": { name: "Skog" } },
];

const contentType = "activity-location";

module.exports = async () => {
  const created = [];
  const updated = [];

  for (const size of data) {
    let entry;
    for (const locale of Object.keys(size)) {
      entry = await findEntry(contentType, { name: size[locale].name, _locale: locale });
      if (entry) break;
    }

    const result = await createOrUpdateEntry(contentType, entry?.id, size);
    updated.push(result.updated);
    created.push(result.created);
  }
  console.log("Created:", created);
  console.log("Updated:", updated);
};
