const { writeProgramToStrapi } = require("./utils/writeToStrapi");
const { readFileSync } = require("fs");


module.exports = async (config) => {

  const programDataString = readFileSync("./migrations/data/program_data.json");
  const programData = JSON.parse(programDataString);

  await writeProgramToStrapi(programData, config.forceUpdate, config.testing);
};
