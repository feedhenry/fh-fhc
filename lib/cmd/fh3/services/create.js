/* globals i18n */
var common = require("../../../common");
var ini = require('../../../utils/ini');
var util = require('util');
var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");

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
    'template' : 'p',
    'env' : 'e',
    0 : 'title',
    1 : 'template',
    2 : 'env'
  },
  'describe' : {
    'title' : i18n._('Title of the Service that you want create'),
    'template' : i18n._('ID of the template, see `fhc templates services`'),
    'env' : i18n._('Unique 24 character GUID of the environment that you want deploy the project after it be created')
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
      payload.template = template[0];
      common.doApiCall(fhreq.getFeedHenryUrl(), "box/api/connectors", payload, i18n._("Error creating service: "), cb);
    });
  },'postCmd': function(argv, params, cb) {
    if (params && !argv.json) {
      return cb(null, util.format(i18n._("Service '%s' created successfully"), params.title));
    } else {
      return cb(null,params);
    }
  }
};

