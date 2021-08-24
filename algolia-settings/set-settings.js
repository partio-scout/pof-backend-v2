const algolia = require("algoliasearch");
const settings = require("./index-settings");

const applicationID = process.argv[2];
const adminKey = process.argv[3];

async function run() {
  console.log("Targeting application:", applicationID);

  const client = algolia(applicationID, adminKey);

  for (const [indexName, indexSettings] of Object.entries(settings.indexes)) {
    for (const environment of settings.environments) {
      const name = `${environment}_${indexName}`;
      console.log("Settings settings for index:", name);
      const index = client.initIndex(name);
      await index.setSettings(indexSettings.settings);
    }
  }
}

run();
