/* globals i18n */
var fhreq = require("../../../utils/request");
var fhc = require("../../../fhc");
var util = require('util');

module.exports = {
  'desc' : i18n._('Update service'),
  'examples' :
  [{
    cmd : 'fhc services create --service=<service> --propName=<propName> --propValue=<propValue>',
    desc : i18n._('Update service via create a new property or by updating a existing.')
  }],
  'demand' : ['service','propName','propValue'],
  'alias' : {
    'service' : 's',
    'propName' : 'p',
    'propValue' : 'v',
    0 : 'service',
    1 : 'propName',
    2 : 'propValue'
  },
  'describe' : {
    'service' : i18n._('Unique 24 character GUID of the service'),
    'propName' : i18n._('Name of the property.'),
    'propValue' : i18n._('Value of the property')
  },
  'customCmd' : function(params,cb) {
    fhc.services.read({service:params.service}, function(err, service) {
      if (err) {
        return cb(err);
      }
      if (!service) {
        return cb(i18n._('Service not found: ') + params.service);
      }

      service[params.propName] = params.propValue;

      fhreq.PUT(fhreq.getFeedHenryUrl(), "box/api/connectors/" + params.service, service, function(err, remoteData, raw, response) {
        if (err) {
          return cb(err);
        }

        if (response.statusCode === 200) {
          return cb(null, util.format(i18n._("Service '%s' update successfully with the propName '%s' and propValue '%s'"),
            service.title,
            params.propName,
            params.propValue)
          );
        } else {
          return cb(raw);
        }
      });
    });
  }
};


