const strapi = require("strapi");

// NEEDS AZURE IMPLEMENTATION
// const projectId = process.env.GOOGLE_CLOUD_PROJECT;
// const environment = (process.env.NODE_ENV || "production").toUpperCase();

/**
 * NEEDS AZURE IMPLEMENTATION
 */
const accessSecret = async (secretName) => {
  
};

/**
 * NEEDS AZURE IMPLEMENTATION
 * Get secrets from ? and set them as environment variables.
 * @param  {...string} secrets The keys of the secrets to get from Secret Manager
 */
async function loadSecretsToEnv(...secrets) {
  const accessProjectSecret = accessSecret(projectId);

  for (const key of secrets) {
    process.env[key] = await accessProjectSecret(key);
    console.log("Loaded secret", key, "into environment");
  }
}

async function main() {
  // NEEDS AZURE IMPLEMENTATION
  // await loadSecretsToEnv(
  //   `STRAPI_INSTANCE_CONNECTION_NAME_${environment}`,
  //   `STRAPI_DATABASE_NAME_${environment}`,
  //   `STRAPI_DATABASE_USERNAME_${environment}`,
  //   `STRAPI_DATABASE_PASSWORD_${environment}`
  // );
  strapi().start();
}

main();
