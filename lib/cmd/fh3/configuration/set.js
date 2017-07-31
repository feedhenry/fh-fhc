/* globals i18n */
var fhc = require("../../../fhc");
var common = require('../../../common.js');
var fhreq = require("../../../utils/request");

module.exports = {
  'desc' : i18n._('Manage client app properties configuration'),
  'examples' : [{
    cmd : 'fhc configuration list --app=<app> --destination=<destination> --property=<property> --value=<value>',
    desc : i18n._('Set <value> for <property> configuration from <app> for the <destination>')
  }],
  'demand' : ['app','property','value','destination'],
  'alias' : {
    'app' : 'a',
    'destination' : 'd',
    'property' : 'p',
    'value' : 'v',
    0 : 'app',
    1 : 'destination',
    2 : 'property',
    3 : 'value'
  },
  'describe' : {
    'app' : i18n._('Unique 24 character GUID of the app you want to see the properties configuration'),
    'property' : i18n._("Property which you want set a value (E.g 'remote Debug')"),
    'value' : i18n._('Value that you want set into the property (E.g true)'),
    'destination' : i18n._('The destination which you want see the properties configuration. (E.g android)')
  },
  'customCmd': function(params, cb) {
    fhc.configuration.list({app:params.app, destination:params.destination, json:true}, function(err,config) {
      if (err) {
        return cb(err);
      }
      var payload = {payload:{"template":params.app, destination: params.destination, config: config}};
      payload.payload.config[params.property] = params.value;
      var uri = "box/srv/1.1/ide/" + fhc.curTarget + "/config/update";
      common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, i18n._("Error setting destination config: "), cb);
    });
  }
};