/* globals i18n */
var templates = require('../../common/templates.js');
var async = require('async');
var common = require('../../../common');

var args;
module.exports = {
  'desc': i18n._('Creates an application.'),
  'examples': [
    {
      cmd: "fhc app create --project=1a2b3c --title=My New App --type=cloud_nodejs --env=dev",
      desc: i18n._("Creates a new hybrid app from template")
    },
    {
      cmd: "fhc app create --project=1a2b3c --title=My New App --type=cloud_nodejs --repo=git:///some.com/repo.git --branch=refs/heads/my-branch",
      desc: i18n._("Creates a new hybrid app from a git repo")
    }
  ],
  'demand': ['project', 'title', 'type'],
  'alias': {
    0: 'project',
    'project': 'p',
    'title': 't',
    'env': 'e',
    'wait': 'w'
  },
  'describe': {
    'project': i18n._('Unique 24 character GUID of the project you want this app to be created in.'),
    'type': i18n._('The type of app.'),
    'title': i18n._('A title for your app.'),
    'template': i18n._('Template of your app - e.g. hello_world_mbaas_instance. See fhc templates apps.'),
    'repo': i18n._('Repository to clone your app from.'),
    'branch': i18n._('Git branch to clone from.'),
    'env': i18n._('If specified and the app is deployable, the app will be deployed to this environment automatically. Set it to "none" will not deploy the app.'),
    'wait': i18n._('Optional. If this is set to true, the command will wait until the app is deployed (if enabled).')
  },
  'defaults': {
    'template': 'hello_world_mbaas_instance'
  },
  'url': function (argv) {
    return "box/api/projects/" + argv.project + "/apps";
  },
  'method': 'post',
  'preCmd': function (argv, cb) {
    args = argv;
    var params = {
      title: argv.title,
      project: argv.project,
      connections: []
    };

    var setAutoDeploy = function (params) {
      if (argv.env) {
        params.template.autoDeployOnCreate = argv.env;
      }
    };
    if (argv.repo) {
      params.template = {
        repoUrl: argv.repo,
        repoBranch: argv.branch || "refs/heads/master",
        type: argv.type,
        imported: true
      };

      setAutoDeploy(params);
      return cb(null, params);
    } else {
      var templateId = argv.template || 'hello_world_mbaas_instance';
      templates({_: ['apps', templateId]}, function (err, template) {
        if (err) {
          return cb(err);
        }

        if (!template) {
          return cb(i18n._('Template not found: ') + templateId);
        }
        params.template = template;
        setAutoDeploy(params);
        return cb(null, params);
      });
    }
  },
  'postCmd': function(params, cb){
    if(args && (args.wait === true || args.wait === 'true')){
      async.map([params.scmCacheKey], common.waitFor, function(err, logs){
        if(err){
          return cb(err);
        }
        params.logs = logs[0];
        return cb(null, params);
      });
    } else {
      process.nextTick(function(){
        cb(null, params);
      });
    }
  }
};
