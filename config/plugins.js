module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: 'office@sedmi-kontinent.rs',
        defaultReplyTo: 'office@sedmi-kontinent.rs',
      },
    },
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  "netlify-deployments": {
    enabled: true,
    config: {
      accessToken: env('NETLIFY_DEPLOYMENTS_PLUGIN_ACCESS_TOKEN'),
      sites: [
        {
          name: 'sedmi-kontinent',
          id: env('NETLIFY_SITE_ID'),
          buildHook: env('NETLIFY_BUILD_HOOK'),
          branch: 'main' // optional
        }
      ]
    }
  }
});