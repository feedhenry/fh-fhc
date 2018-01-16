/* globals i18n */
var common = require('../../../../common.js');
var util = require('util');
var fhc = require("../../../../fhc");
var fhreq = require("../../../../utils/request");
var fs = require('fs');

module.exports = {
  'desc' : i18n._('List Push Notifications Variants for an app'),
  'examples' :
    [{
      cmd : 'fhc ups variant add --app=<appId> --name=<name> --type=android --serverKey=<serverKey> --senderId=<senderId>',
      desc : i18n._("Add Android variant for the <appId> with the <name>, and <serverKey> and <senderId>")
    },
    {
      cmd : 'fhc ups variant add --app=<appId> --name=<name> --type=ios --production=<true|false> --passphrase=<passphrase> --certificate=<certificate>',
      desc : i18n._("Add Android variant for the <appId> with the <name>, and <production> and <passphrase>")
    },
    {
      cmd : 'fhc ups variant add --app=<appId> --name=<name> --type=windowns --package=<package> --secret=<secret>',
      desc : i18n._("Add Android variant for the <appId> with the <name>, and <production> and <passphrase>")
    }],
  'demand' : ['app','name','type'],
  'alias' : {
    'app': 'a',
    'name': 'n',
    'type': 't',
    'serverKey': 'sk',
    'senderId': 'si',
    'production': 'p',
    'passphrase': 'pp',
    'certificate': 'cert',
    'package': 'pkg',
    'secret': 'st',
    'json': 'j',
    0 : 'app',
    1 : 'name',
    2 : 'type'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of your application."),
    'name' : i18n._("Name of the variant."),
    'type' : i18n._("Type of the variant. Choose from: \n\t\t - android \n\t\t - ios \n\t\t - windows (WNS)\n "),
    'serverKey' : i18n._("Server Key to use Android Firebase Cloud Messaging (E.g. AIza5a448c2f31700a466fbc9d33d33942b043a27596)"),
    'senderId' : i18n._("Sender ID to use Android Firebase Cloud Messaging (E.g.contact@email.com)"),
    'production' : i18n._("To inform if is a production certificate to use the Apple Push Network. Default value is false."),
    'passphrase' : i18n._("Password of the certificate  to use the Apple Push Network"),
    'certificate' : i18n._("Path with the name of the iOS certificate file, *.p12, to use the Apple Push Network."),
    'package' : i18n._("Package SID to use the Microsoft Push Notification Service (MPNS). (E.g ms-app://s-1-15-2-3183935804-3637592178)"),
    'secret' : i18n._("Client Secret  to use the Microsoft Push Notification Service (MPNS)."),
    'json' : i18n._("Output in json format")
  },
  'preCmd': function(params, cb) {
    params.type = params.type.toLowerCase();
    if (params.type !== 'android' && params.type !== 'windowns' && params.type !== 'ios' ) {
      return cb(i18n._("Invalid type param."));
    }
    switch (params.type) {
    case "ios":
      if (!hasRequiredIosParams(params)) {
        return cb(i18n._("Inform all required parameters to create an iOS variant."));
      }
      break;
    case "windows":
      params.type = "windows_wns";
      if (!hasRequiredWinParams(params)) {
        return cb(i18n._("Inform all required parameters to create an Win variant."));
      }
      break;
    default:
      if (!hasRequiredAndroidParams(params)) {
        return cb(i18n._("Inform all required parameters to create an Android variant."));
      }
    }
    fhc.ups.config({app:params.app, json:true}, function(err,data) {
      if (err) {
        return cb(err);
      }
      params.pushApplicationID = data.pushApplicationID;
      return cb(null, params);
    });
  },
  'customCmd': function(params, cb) {
    var playload = {name:params.name};
    var url = "/api/v2/ag-push/rest/applications/" + params.pushApplicationID + "/" + params.type;

    switch (params.type) {
    case "ios":
      playload = createIosPlayload(playload, params);
      break;
    case "windows":
      playload = createWinPlayload(playload, params);
      break;
    default:
      playload = createAndroidPlayload(playload, params);
    }

    if ( params.type === 'ios') {
      fhreq.doRequestWithDataObjectValues(url, playload, null, null, util.format(i18n._("Variant '%s' created successfully"), params.name), cb);
    } else {
      common.doApiCall(fhreq.getFeedHenryUrl(), url, playload, i18n._("Error to add variant: "), cb);
    }
  }
};

/**
 * Create the playload for iOS platform variant
 * @param playload
 * @param params
 * @returns {*}
 */
function createIosPlayload(playload,params) {

  if (params.production) {
    params.production = 'true';
  } else {
    params.production = 'false';
  }

  playload = [{
    name: 'name',
    value: params.name
  },{
    name: 'production',
    value: params.production
  },{
    name: 'passphrase',
    value: params.passphrase
  },{
    name: 'certificate',
    value: fs.createReadStream(params.certificate)
  }];
  return playload;
}

/**
 * Check if has all requirements to create an ios variant
 * @param params
 * @returns {boolean}
 */
function hasRequiredIosParams(params) {
  if ( !params.passphrase || !params.certificate) {
    return false;
  }
  return true;
}

/**
 * Create the playload for Android platform variant
 * @param playload
 * @param params
 * @returns {*}
 */
function createAndroidPlayload(playload,params) {
  playload.projectNumber = params.senderId;
  playload.googleKey = params.serverKey;
  playload.name = params.name;
  return playload;
}

/**
 * Check if has all requirements to create an Android variant
 * @param params
 * @returns {boolean}
 */
function hasRequiredAndroidParams(params) {
  if ( !params.serverKey || !params.senderId) {
    return false;
  }
  return true;
}

/**
 * Create the playload for Windows platform variant
 * @param playload
 * @param params
 * @returns {*}
 */
function createWinPlayload(playload,params) {
  playload.clientSecret = params.secret;
  playload.sid = params.package;
  playload.protocolType = 'wns';
  return playload;
}

/**
 * Check if has all requirements to create an Windows variant
 * @param params
 * @returns {boolean}
 */
function hasRequiredWinParams(params) {
  if ( !params.package || !params.secret) {
    return false;
  }
  return true;
}