const strapi = require("strapi");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();

/**
 * Curried function for getting secrets from GCP Secret Manager.
 *
 * The first call's parameter is the id of the GCP project to target,
 * and the returned function's parameter is the secret's name.
 * @param {string} projectId The GCP project id
 * @returns Function for accessing secrets in a project
 */
const accessSecret = (projectId) => async (secretName) => {
  const fullSecretName = `projects/${projectId}/secrets/${secretName}/versions/latest`;

  try {
    const [version] = await client.accessSecretVersion({
      name: fullSecretName,
    });

    // Extract the payload as a string.
    return version.payload.data.toString();
  } catch (error) {
    console.error("Error while getting secret from Secret Manager", error);
    return "";
  }
};

/**
 * Get secrets from GCP Secret Manager and set them as environment variables.
 * @param  {...string} secrets The keys of the secrets to get from Secret Manager
 */
async function loadSecretsToEnv(...secrets) {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;

  const accessProjectSecret = accessSecret(projectId);

  for (const key of secrets) {
    process.env[key] = await accessProjectSecret(key);
    console.log("Loaded secret", key, "into environment");
  }
}

async function main() {
  await loadSecretsToEnv(
    "STRAPI_INSTANCE_CONNECTION_NAME_DEV",
    "STRAPI_DATABASE_NAME_DEV",
    "STRAPI_DATABASE_USERNAME_DEV",
    "STRAPI_DATABASE_PASSWORD_DEV"
  );
  strapi().start();
}

main();
