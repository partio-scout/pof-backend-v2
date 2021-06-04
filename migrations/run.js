const yargs = require("yargs");

const fetchProgram = require("./fetch-program");
const writeProgram = require("./write-program");

const argv = yargs
  .option("url", {
    description: "The url to the program data",
    default: "https://pof-backend.partio.fi/spn-ohjelma-json-taysi",
    alias: "u",
    type: "string",
  })
  .option("fetch", {
    description: "Fetch the program data from old api. If option -n (noCache) is not given, api's responses are cached so that subsequent runs don't hit the api.",
    alias: "f",
    type: "boolean",
  })
  .option("write", {
    description: "Write the program data to Strapi. If option -t (test) is given, only one Age Group is written.",
    alias: "w",
    type: "boolean",
  })
  .option("noCache", {
    description: "Don't use cached api responses.",
    alias: "n",
    type: "boolean",
  })
  .option("test", {
    description: "Run in test mode (less data migrated)",
    alias: "t",
    type: "boolean",
  })
  .help()
  .alias("help", "h").argv;


const config = {
  testing: argv.test,
  programUrl: argv.url,
  noCache: argv.noCache,
};

const runMigrations = async (config) => {
  try {
      if (argv.fetch) {
        await fetchProgram(config);
      }
      if (argv.write) {
        await writeProgram(config);
      }
      if (!argv.write && !argv.fetch) {
        console.log("Give option -f to fetch data, and/or option -w to write data. ")
      }
  } catch (error) { 
    console.error(error);
  }
};

(async () => {
  await runMigrations(config);
})();
