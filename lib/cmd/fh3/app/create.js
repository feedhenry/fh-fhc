var templates = require('../../common/templates.js');
module.exports = { 
  'desc' : 'Creates an application.',
  'examples' : [
    {cmd : "fhc app create --project=1a2b3c --title=My New App --type=cloud_nodejs --env=dev", desc : "Creates a new hybrid app from template" },
    {cmd : "fhc app create --project=1a2b3c --title=My New App --repo=git:///some.com/repo.git --branch=master", desc : "Creates a new hybrid app from a git repo" }
  ],
  'demand' : ['project', 'title'],
  'alias' : {
    0 : 'project',
    'project' : 'p',
    'title' : 't',
    'env': 'e'
  },
  'describe' : {
    'project' : 'Unique 24 character GUID of the project you want this app to be created in',
    'title' : 'A title for your app',
    'template' : 'Template of your app - e.g. hello_world_mbaas_instance. See fhc templates apps',
    'repo' : 'Repository to clone your app from',
    'branch' : 'Git branch to clone from',
    'env': 'If specified and the app is deployable, the app will be deployed to this environment automatically. Set it to "none" will not deploy the app'
  },
  'defaults' : {
    'template' : 'hello_world_mbaas_instance'
  },
  'url' : function(argv){
    return "box/api/projects/" + argv.project + "/apps";
  },
  'method' : 'post',
  'preCmd' : function(argv, cb) {
    var params = {
      title : argv.title,
      project : argv.project,
      connections : []
    };

    var setAutoDeploy = function(params){
      if(argv.env){
        params.template.autoDeployOnCreate = argv.env;
      }
    }
    
    if (argv.repo){
      params.template = {
        repoUrl : argv.repo,
        repoBranch: argv.branch || "refs/heads/master",
        type: argv.type,
        imported: true
      };

      setAutoDeploy(params);
      return cb(null, params);
    }else{
      var templateId = argv.template || 'hello_world_mbaas_instance';
      templates({ _ : ['apps', templateId]}, function(err, template) {
        if (err) {
          return cb(err);
        }

        if (!template){
          return cb('Template not found: ' + templateId);
        } 
        params.template = template;
        setAutoDeploy(params);
        return cb(null, params);
      });
    }
  }
};
