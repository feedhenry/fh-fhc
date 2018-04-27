/* globals i18n */
var fhreq = require("../../../utils/request");
var fhc = require("../../../fhc");
var util = require('util');

module.exports = {
  'desc' : i18n._('Update config of application'),
  'examples' :
    [{
      cmd : 'fhc app update config --project=<project> --app=<app> --propName=<propName> --propValue=<propValue>',
      desc : i18n._('Update config properties of the <app> via create a new property or by updating a existing into a domain.')
    }],
  'demand' : ['project','app','propName','propValue'],
  'alias' : {
    'project' : 'p',
    'app' : 'a',
    'propName' : 'n',
    'propValue' : 'v',
    0 : 'project',
    1 : 'app',
    2 : 'propName',
    3 : 'propValue'
  },
  'describe' : {
    'project' : i18n._('Unique 24 character GUID of the project'),
    'app' : i18n._('Unique 24 character GUID of the plaication'),
    'propName' : i18n._('Name of the property.'),
    'propValue' : i18n._('Value of the property')
  },
  'customCmd' : function(params,cb) {
    fhc.app.read({project:params.project, app:params.app}, function(err, app) {
      if (err) {
        return cb(err);
      }
      if (!app) {
        return cb(util.format(i18n._("Application '%s' from the project '%' not found"), params.app, params.project));
      }
      var url = "box/srv/1.1/ide/" + fhc.curTarget + "/app/setconfig";
      var playload = {guid:params.app, key:params.propName, value: params.propValue};
      fhreq.POST(fhreq.getFeedHenryUrl(), url , playload, function(er, remoteData) {
        if (er) {
          return cb(i18n._("Error reading app: ") + er);
        } else {
          if (remoteData.status !== 'ok') {
            return cb(remoteData.messsage);
          }
          return cb(null, i18n._("Config property set ok"));
        }
      });
    });
  }
};


