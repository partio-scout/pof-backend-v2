const axios = require("axios");
const https = require("https");
const rateLimit = require("axios-rate-limit");
const { readFileSync, existsSync, exists } = require("fs");

const createInstance = () => {
  // Read the config from file
  const configPath = "migrations/data/config.json";

  if (!existsSync(configPath)) {
    throw new Error(
      "No config file present. Create it to `migrations/data/config.json`"
    );
  }

  const configJson = readFileSync(configPath);
  const config = JSON.parse(configJson);

  const axiosInstance = axios.create({
    baseURL: config.strapiUrl,
    headers: {
      Authorization: `Bearer ${config.strapiAdminToken}`,
    },
    // This is important!! Without it the migration fails at some point to an error: connect ETIMEDOUT. More info here: https://stackoverflow.com/a/63585550/6025830
    httpsAgent: new https.Agent({ keepAlive: true }),
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        throw new Error(
          JSON.stringify(
            {
              status: error.response?.status,
              statusText: error.response?.statustext,
              url: error.response?.config.baseURL + error.response?.config.url,
              method: error.response?.config.method,
              inputData: error.response?.config.data,
              outputMessage: error.response?.data.message,
              outputData: error.response?.data.data,
            },
            undefined,
            4
          )
        );
      }
      throw error;
    }
  );
  return axiosInstance;
};

const rateLimitedInstance = rateLimit(createInstance(), { maxRPS: 20 });

module.exports = {
  rateLimited: rateLimitedInstance,
  fast: createInstance(),
};
