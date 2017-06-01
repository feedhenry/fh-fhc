/* globals i18n */
var async = require('async');
var fhc = require("../../../fhc");
var _ = require('underscore');

module.exports = {
  'desc' : i18n._('Clone project'),
  'examples' :
  [{
    cmd : 'fhc projects clone --project=<project>',
    desc : "It does a 'git clone' of each each App in your Project into the current working directory."
  }],
  'demand' : ['project'],
  'alias' : {
    'project': 'p',
    0 : 'project'
  },
  'describe' : {
    'project' : i18n._('Unique 24 character GUID of the project')
  },
  'customCmd': function(params, cb) {
    fhc.app.list({project:params.project}, function(err, apps) {
      if (err) {
        return cb(err);
      }
      function doClone(app, cb1) {
        fhc.clone({project:params.project, app:app.guid}, cb1);
      }
      async.mapSeries(apps.apps, doClone, function(err, results) {
        if (err) {
          return cb(err);
        }
        results.message = '';
        _.each(results, function(result) {
          results.message += result.stdout + '\n' + result.stderr;
        });
        return cb(null, results);
      });
    });
  }
};