module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-npm')(shipit);
  require('./lib/templates')(shipit);

  var deployFolder = '/home/deploy/api_client_test';
  var workspace = '/tmp/api_workspace'
  shipit.initConfig({
    default: {
      workspace: workspace,
      deployTo: deployFolder,
      repositoryUrl: 'https://github.com/sudodoki/api_client_test.git',
      subfolder: 'API_v2',
      npm: {
        subfolder: 'API_v2'
      },
      templates: {
        context: {
          env: workspace + '/API_v2/config/production.json',
          package: workspace + '/API_v2/package.json',
        },
        files: {
          'api-nginx.conf': {
            destination: '/etc/nginx/sites-enabled/'
          },
          'api-upstart.conf': {
            destination: '/etc/init/deploy/',
          }
        }
      },
      ignores: ['.git'],
      keepReleases: 2,
      shallowClone: true
    },
    staging: {
      servers: 'deploy@api.sudodoki.name',
      key: '/Users/sudodoki/.ssh/deploy_do'
    }
  });
};