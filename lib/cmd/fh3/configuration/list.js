/* globals i18n */
var destinations = ['studio', 'android', 'embed', 'iphone', 'ipad', 'blackberry', 'windowsphone7'];
var fhc = require("../../../fhc");
var common = require('../../../common.js');
var fhreq = require("../../../utils/request");
var async = require('async');

module.exports = {
  'desc' : i18n._('List client app properties configuration'),
  'examples' : [{
    cmd : 'fhc configuration list --app=<app>',
    desc : i18n._('List properties configuration from <app> for all destinations available')
  },{
    cmd : 'fhc configuration list --app=<app> --destination=<destination>',
    desc : i18n._('List properties configuration from <app> for the <destination>')
  }],
  'demand' : ['app'],
  'alias' : {
    'app' : 'a',
    'destination' : 'd',
    0 : 'app',
    1 : 'destination'
  },
  'describe' : {
    'app' : i18n._('Unique 24 character GUID of the app you want to see the properties configuration'),
    'destination' : i18n._('The destination which you want see the properties configuration. (E.g android)')
  },
  'customCmd': function(params, cb) {
    function getDestinationForApp(destination, cb) {
      var payload = {payload: {"template": params.app, destination: destination}};
      var uri = "box/srv/1.1/ide/" + fhc.curTarget + "/config/list";
      common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, i18n._("Error listing destination config: "), cb);
    }
    if (!params.destination) {
      async.map(destinations, getDestinationForApp, function(err, results) {
        if (err) {
          return cb(err);
        }
        var data = {};
        for (var i=0; i<results.length; i++) {
          data[destinations[i]] = results[i];
        }
        return cb(null, data);
      });
    } else {
      getDestinationForApp(params.destination, cb);
    }
  }
};