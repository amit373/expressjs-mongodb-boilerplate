module.exports = {
  apps: [
    {
      name: 'app',
      script: './index.js',
      env: {
        NODE_ENV: 'development',
      },
      env_test: {
        NODE_ENV: 'test',
      },
      env_staging: {
        NODE_ENV: 'staging',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};

/**
 * pm2 start ecosystem.config.js --env production
 * pm2 start ecosystem.config.js --env staging
 * pm2 restart/reload ecosystem.config.js --env staging
*/
