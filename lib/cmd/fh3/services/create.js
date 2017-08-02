/* globals i18n */
var common = require("../../../common");
var ini = require('../../../utils/ini');
var util = require('util');
var fhc = require("../../../fhc");


module.exports = {
  'desc' : i18n._('Create service'),
  'examples' :
  [{
    cmd : 'fhc services create --title=<title>',
    desc : i18n._('Create a service with the <title>')
  },{
    cmd : 'fhc services create --title=<title> --template=<template>',
    desc : i18n._('Create a service with the <title> and <template>')
  },{
    cmd : 'fhc services create --title=<title> --template=<template> --env=<environment>',
    desc : i18n._('Create a service with the <title> and <template>, after deploy it on <environment>')
  }],
  'demand' : ['title'],
  'alias' : {
    'title' : 't',
    'template' : 't',
    'env' : 'e',
    'json': 'j',
    0 : 'title',
    1 : 'template',
    2 : 'env'
  },
  'describe' : {
    'title' : i18n._('Title of the Service that you want create'),
    'template' : i18n._('Unique 24 character GUID of the template'),
    'env' : i18n._('Unique 24 character GUID of the environment that you want deploy the project after it be created'),
    'json' : i18n._("Output in json format")
  },
  'customCmd' : function(params,cb) {
    var deployEnvironment = ini.getEnvironment(params, true);
    var payload =  {
      title: params.title,
      apps:[],
      services:[],
      autoDeployOnCreate: deployEnvironment || ""
    };

    fhc.templates.services({ id:params.template || "new-service", json:true }, function(err, template) {
      if (err) {
        return cb(err);
      }
      if (!template) {
        var msg = i18n._('Template not found: ') + params.template;
        if (params.json) {
          return cb(null,msg);
        }
        return cb(null, {msg:msg});
      }
      payload.template = template;
      common.createService(payload,cb);
    });
  },'postCmd': function(argv, response, cb) {
    if (response && !argv.json) {
      return cb(null, util.format(i18n._("Service '%s' create successfully"), response.title));
    } else {
      return cb(null,response);
    }
  }
};


