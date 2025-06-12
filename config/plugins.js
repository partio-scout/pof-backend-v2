module.exports = ({ env }) => ({
  "deploy-site": {
    enabled: true,
    resolve: "./src/plugins/deploy-site",
  },
  guide: {
    enabled: true,
    resolve: "./src/plugins/guide",
  },
  "search-indexer": {
    enabled: true,
    resolve: "./src/plugins/search-indexer",
  },
  tinymce: {
    enabled: true,
    config: {
      editor: {
        editorConfig: {
          language: "fi",
          menubar: true,
          extended_valid_elements: "span, img, small",
          plugins:
            "advlist autolink lists link image preview anchor \
                    searchreplace visualblocks fullscreen table nonbreaking \
                    insertdatetime media table help wordcount",
          toolbar:
            "undo redo | styles | bold italic forecolor backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    media table link|\
                    bullist numlist outdent indent | removeformat",
          style_formats: [
            {
              title: "Headings",
              items: [
                { title: "h1", block: "h1" },
                { title: "h2", block: "h2" },
                { title: "h3", block: "h3" },
                { title: "h4", block: "h4" },
                { title: "h5", block: "h5" },
                { title: "h6", block: "h6" },
              ],
            },

            {
              title: "Text",
              items: [
                { title: "Paragraph", block: "p" },
                {
                  title: "Paragraph with small letters",
                  block: "small",
                },
              ],
            },
          ],
        },
      },
    },
  },
  transformer: {
    enabled: true,
    config: {
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      },
      requestTransforms: {
        wrapBodyWithDataKey: true,
      },
    },
  },
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: env("SENDGRID_DEFAULT_FROM_ADDRESS"),
        defaultReplyTo: env("SENDGRID_DEFAULT_REPLY_TO_ADDRESS"),
      },
    },
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET')
    }
  },
  upload: {
    config: {
      // sizeLimit: 250 * 1024 * 1024, // Now
      provider: 'strapi-provider-upload-azure-storage',
      providerOptions: {
        authType: env("AZURE_STORAGE_AUTH_TYPE", "default"),
        account: env("AZURE_ACCOUNT_NAME"),
        accountKey: env("AZURE_ACCOUNT_KEY"),//either account key or sas token is enough to make authentication 
        sasToken: env("STORAGE_ACCOUNT_SAS_TOKEN"),
        serviceBaseURL: env("AZURE_STORAGE_URL"), // optional
        containerName: env("AZURE_CONTAINER_NAME"),
        defaultPath: "assets",
        cdnBaseURL: env("AZURE_STORAGE_CDN_URL"), // optional
        defaultCacheControl: env("AZURE_STORAGE_CACHE_CONTROL"), // optional
        removeCN: env("AZURE_REMOVE_CONTAINER_NAME"), // optional, if you want to remove container name from the URL 
      },
    }
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
});

