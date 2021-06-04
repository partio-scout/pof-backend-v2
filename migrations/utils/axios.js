const axios = require("axios");
const rateLimit = require('axios-rate-limit');
const { readFileSync, existsSync, exists } = require('fs');

const createInstance = () => {
  // Read the config from file
  const configPath = 'migrations/data/config.json';

  if (!existsSync(configPath)) {
    throw new Error('No config file present. Create it to `migrations/data/config.json`');
  }

  const configJson = readFileSync(configPath);
  const config = JSON.parse(configJson);

  const axiosInstance = axios.create({
    baseURL: config.strapiUrl,
    headers: {
      Authorization: `Bearer ${config.strapiAdminToken}`,
    },
  });
  return axiosInstance;
}


const rateLimitedInstance = rateLimit(createInstance(), { maxRPS: 5 });

module.exports = rateLimitedInstance;
