/* globals i18n */
var common = require("../../../common");
var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");

module.exports = {
  'desc' : i18n._('List service data-sources'),
  'examples' :
  [{
    cmd : 'fhc services data-sources --service=<service>',
    desc : i18n._('List all data-sources of the <service>')
  }],
  'demand' : ['service'],
  'alias' : {
    'service':'s',
    'json' : 'j',
    0 : 'service',
    1 : 'json'
  },
  'describe' : {
    'service' : i18n._('Unique 24 character GUID of the service'),
    'json' : i18n._('Output into json format')
  },
  'customCmd': function(params, cb) {
    fhc.services.read({service:params.service}, function(err, service) {
      if (err) {
        return cb(err);
      }

      common.doGetApiCall(fhreq.getFeedHenryUrl(), "api/v2/services/" + service.apps[0].guid + "/data_sources", "Error reading Service data sources. ", function(err, dataSources) {
        if (err) {
          return cb(err);
        }
        if (!params.json) {
          params._table = common.createTableForDataSources(dataSources || [], service);
        }
        cb(null, params);
      });
    });
  }
};