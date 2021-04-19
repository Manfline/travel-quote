const pkg = require('./package.json');

module.exports = {
  apps: [
    {
      name: pkg.name,
      script: pkg.main,
      node_args: '-r dotenv/config',
      instances: 1,
      autorestart: true,
      watch: true,
      exec_mode: 'cluster',
      ignore_watch: ['node_modules', 'spec']
    }
  ]
};
