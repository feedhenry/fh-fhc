/* globals i18n */
var common = require("../../../common");
var ini = require('../../../utils/ini');
var templates = require('../../common/templates.js');
var util = require('util');


module.exports = {
  'desc' : i18n._('Create project'),
  'examples' :
  [{
    cmd : 'fhc projects create --title=<title>',
    desc : i18n._('Create a  with the <title>')
  },{
    cmd : 'fhc projects create --title=<title> --template=<template>',
    desc : i18n._('Create a project with the <title> and <template>')
  },{
    cmd : 'fhc projects create --title=<title> --template=<template> --env=<environment>',
    desc : i18n._('Create a project with the <title> and <template>, after deploy it on <environment>')
  }],
  'demand' : ['title'],
  'alias' : {
    'title' : 't',
    'template' : 'tp',
    'env' : 'e',
    'json': 'j',
    0 : 'title',
    1 : 'template',
    2 : 'env'
  },
  'describe' : {
    'title' : i18n._('Title of the Project that you want create'),
    'template' : i18n._('Unique 24 character GUID of the template'),
    'env' : i18n._('Unique 24 character GUID of the environment that you want deploy the project after it be created'),
    'json' : i18n._("Output in json format")
  },
  'customCmd' : function(params,cb) {
    var deployEnvironment = ini.getEnvironment(params, true);
    var payload =  {
      title: params.title,
      apps:[],
      projects:[],
      autoDeployOnCreate: deployEnvironment || ""
    };

    templates({ _ : ['projects', params.template || "bare_project"] }, function(err, template) {
      if (err) {
        return cb(err);
      }
      if (!template) {
        return cb(i18n._('Template not found: ') + params.template);
      }
      payload.template = template;
      common.createProject(payload,cb);
    });
  },'postCmd': function(argv, response, cb) {
    if (response && !argv.json) {
      return cb(null, util.format(i18n._("Project '%s' create successfully"), response.title));
    }
    return cb(null, response);
  }
};


