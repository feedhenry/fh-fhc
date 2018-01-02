/* globals i18n */
var fhc = require("../../../fhc");
var common = require('../../../common.js');
var fhreq = require("../../../utils/request");

module.exports = {
  'desc' : i18n._('Send Push Notifications for an app'),
  'examples' :
    [{
      cmd : 'fhc ups send --app=<appId> --message=<message> --priority<priority>',
      desc : i18n._("Send the <message> from the <appId> for all variants with the <priority>")
    }],
  'demand' : ['app','message'],
  'alias' : {
    'app': 'a',
    'message': 'm',
    'priority': 'p',
    'json': 'j',
    0 : 'app',
    1 : 'message',
    2 : 'priority'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of your application."),
    'message' : i18n._("Text with the message"),
    'priority' : i18n._("Priority of the alert. The default value is 'normal'. Choose from: \n\t\t - normal \n\t\t - high \n "),
    'json' : i18n._("Output in json format")
  },
  'preCmd': function(params, cb) {
    if (!params.priority) {
      params.priority = "normal";
    } else if (params.priority !== 'normal' && params.priority !== 'high') {
      return cb(i18n._("Invalid priority param."));
    }
    fhc.ups.read({app:params.app, json:true}, function(err,data) {
      if (err) {
        return cb(err);
      }
      params.pushApplicationID = data.pushApplicationID;
      params.masterSecret = data.masterSecret;
      return cb(null, params);
    });
  },
  'customCmd': function(params, cb) {
    if (!params.pushApplicationID) {
      return cb(i18n._("Not found appId"));
    }
    var url = "/api/v2/ag-push/rest/sender";
    var playload = {};
    playload.message = {};
    playload.message.alert = params.message;
    playload.message.priority = params.priority;
    playload.message.sound = "default";
    playload.criteria = {};
    var auth = {user:params.pushApplicationID,pass:params.masterSecret};
    common.doApiCallWithAuth(fhreq.getFeedHenryUrl(), url, playload, auth, i18n._("Error to send Push Notification: "), cb);
  }
};