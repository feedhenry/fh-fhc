/* globals i18n */
var fhreq = require("../../../utils/request");
var fhc = require("../../../fhc");
var util = require('util');

module.exports = {
  'desc' : i18n._('Update project'),
  'examples' :
  [{
    cmd : 'fhc projects create --project=<project> --propName=<propName> --propValue=<propValue>',
    desc : i18n._('Update project via create a new property or by updating a existing.')
  }],
  'demand' : ['project','propName','propValue'],
  'alias' : {
    'project' : 's',
    'propName' : 'p',
    'propValue' : 'v',
    'json': 'j',
    0 : 'project',
    1 : 'propName',
    2 : 'propValue'
  },
  'describe' : {
    'project' : i18n._('Unique 24 character GUID of the project'),
    'propName' : i18n._('Name of the property.'),
    'propValue' : i18n._('Value of the property'),
    'json' : i18n._("Output in json format")
  },
  'customCmd' : function(params,cb) {
    fhc.projects.read({project:params.project}, function(err, project) {
      if (err) {
        return cb(err);
      }
      if (!project) {
        return cb(i18n._('Project not found: ') + params.project);
      }

      project[params.propName] = params.propValue;

      fhreq.PUT(fhreq.getFeedHenryUrl(), "box/api/projects/" + params.project, project, function(err, remoteData, raw, response) {
        if (err) {
          return cb(err);
        }

        if (response.statusCode === 200) {
          if (!params.json) {
            return cb(null, util.format(i18n._("Project '%s' update successfully with the propName '%s' and propValue '%s'"),
              project.title,
              params.propName,
              params.propValue)
            );
          }
          return cb(null, response);
        } else {
          return cb(raw);
        }
      });
    });
  }
};


