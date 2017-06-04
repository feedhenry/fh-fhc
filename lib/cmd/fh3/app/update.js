/* globals i18n */
var fhreq = require("../../../utils/request");
var fhc = require("../../../fhc");
var util = require('util');
var common = require("../../../common");

module.exports = {
  'desc' : i18n._('Update application'),
  'examples' :
    [{
      cmd : 'fhc app update --project=<project> --app=<app> --title=<title> --description=<description> --width=<width> --height=<height>',
      desc : i18n._('Update application information as <title>, <description>, <width> and <height>.')
    }],
  'demand' : ['project','app'],
  'alias' : {
    'project' : 'p',
    'app' : 'a',
    'title' : 't',
    'description' : 'd',
    'width' : 'w',
    'height' : 'h',
    0 : 'project',
    1 : 'app',
    2 : 'title',
    3 : 'description',
    4 : 'width',
    5 : 'height'
  },
  'describe' : {
    'project' : i18n._('Unique 24 character GUID of the project'),
    'app' : i18n._('Unique 24 character GUID of the plaication'),
    'title' : i18n._('Title of the application.'),
    'width' : i18n._('Width of the application'),
    'height' : i18n._('Height of the application')
  },
  'customCmd' : function(params,cb) {
    fhc.app.read({project:params.project, app:params.app}, function(err, app) {
      if (err) {
        return cb(err);
      }
      if (!app) {
        return cb(util.format(i18n._("Application '%s' from the project '%' not found"), params.app, params.project));
      }
      app = setParamValues(params,app);
      updateApp(params,app,cb);
    });
  }
};

/**
 * Set values into the app object found to update it.
 * @param params
 * @param app
 * @returns {*}
 */
function setParamValues(params, app) {
  if (params.title) {
    app.title = params.title;
  }
  if (params.width) {
    app.width = params.width;
  }
  if (params.height) {
    app.height = params.height;
  }
  if (params.description) {
    app.description = params.description;
  }
  return app;
}

/**
 *
 */
function updateApp(params,app,cb) {
  var url = "box/api/projects/" + params.project + "/apps/" + params.app;
  common.doPutApiCall(fhreq.getFeedHenryUrl(), url, app, function(err, response) {
    if (err) {
      return cb(err);
    }
    return cb(null, response);
  });
}