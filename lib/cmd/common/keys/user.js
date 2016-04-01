/* globals i18n */
module.exports = userkeys;

userkeys.desc = i18n._("Manage user API Keys");
userkeys.usage = "fhc keys user [list]"
           + "\nfhc keys user add <label>"
           + "\nfhc keys user read <label>"
           + "\nfhc keys user update <old-label> <new-label>"
           + "\nfhc keys user delete <label>"
           + "\nfhc keys user target [<label>]";

var common = require("../../../common");
var fhreq = require("../../../utils/request");
var fhc = require("../../../fhc");
var ini = require('../../../utils/ini');
var targets = require('../../fhc/targets');
var _ = require('underscore');

var headers = ["Label", "Key"];
var fields = ["label", "key"];

function unknown(message, cb){
  return cb( message + "\n" + i18n._("Usage: ") + "\n" + userkeys.usage);
}

function userkeys(argv, cb){
  var args = argv._;
  if(args.length === 0){
    return listKeys(args, cb);
  }

  var action = args[0];
  if("list" === action){
    return listKeys(args, cb);
  } else if("add" === action){
    return addKey(args, cb);
  } else if("read" === action){
    return readKey(args, cb);
  }else if("target" === action){
    return targetKey(args, cb);
  } else if("update" === action){
    return updateKey(args, cb);
  } else if("delete" === action){
    return deleteKey(args, cb);
  } else {
    return unknown("Invalid keys action " + action, cb);
  }
}

function listKeys(args, cb){
  var url = 'box/srv/1.1/ide/' + fhc.curTarget + '/api/list';
  var payload = {type: "user"};
  common.doApiCall(fhreq.getFeedHenryUrl(), url, payload, i18n._("Error reading Api Keys: "), function(err, keys){
    if (err) return cb(err);
    if (ini.get('table') === true) {
      userkeys.table = common.createTableFromArray(headers, fields, keys.list);
    }
    return cb(err, keys);
  });
}

function readKey(args, cb) {
  if (args.length < 2) {
    return unknown(i18n._("Invalid arguments"), cb);
  }
  var label = args[1];
  listKeys([], function(err, keys) {
    if (err) return cb(err);
    var key = _.findWhere(keys.list, {label: label});
    if (!key) return cb(i18n._('Key not found: ') + label);
    if (ini.get('table') === true) {
      userkeys.table = common.createTableFromArray(headers, fields, [key]);
    }
    return cb(err, key);
  });
}

function addKey(args, cb){
  if (args.length < 1) {
    return unknown(i18n._("Invalid arguments"), cb);
  }
  var label = args[1];
  var url = 'box/srv/1.1/ide/' + fhc.curTarget + '/api/create';
  var payload = {
    "type":"user",
    "label": label,
    "fields":{
      "label":label
    }
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), url, payload, i18n._("Error add Api Key: "), function(err, key){
    if (err) return cb(err);
    if (ini.get('table') === true) {
      userkeys.table = common.createTableFromArray(headers, fields, [key.apiKey]);
    }
    return cb(err, key);
  });
}

function updateKey(args, cb) {
  if (args.length < 3) {
    return unknown(i18n._("Invalid arguments"), cb);
  }
  var oldLabel = args[1];
  var newLabel = args[2];

  readKey(['read', oldLabel], function(err, key) {
    if (err) return cb(err);

    var url = "box/srv/1.1/ide/" + fhc.curTarget + "/api/update";
    var payload = {
      "key": key.key,
      "label": newLabel,
      "fields": {
        "label": newLabel
      }
    };
    common.doApiCall(fhreq.getFeedHenryUrl(), url, payload,  i18n._("Error updating key: "), function(err, key){
      if (err) return cb(err);
      if (ini.get('table') === true) {
        userkeys.table = common.createTableFromArray(headers, fields, [key.apiKey]);
      }
      return cb(err, key);
    });
  });
}

function deleteKey(args, cb) {
  if (args.length < 1) {
    return unknown(i18n._("Invalid arguments"), cb);
  }
  var label = args[1];

  readKey(['read', label], function(err, key) {
    if (err) return cb(err);

    var url = "box/srv/1.1/ide/" + fhc.curTarget + "/api/delete";
    var payload = {"key": key.key};
    common.doApiCall(fhreq.getFeedHenryUrl(), url, payload,  i18n._("Error deleting key: "), function(err, key){
      if (err) return cb(err);
      if (ini.get('table') === true) {
        userkeys.table = common.createTableFromArray(headers, fields, [key.apiKey]);
      }
      return cb(err, key);
    });
  });
}

var USER_API_KEY = "user_api_key";
function targetKey(args, cb){
  if (args.length < 1) {
    return unknown(i18n._("Invalid arguments"), cb);
  }

  var label = args[1];

  if(label){
    readKey(['read', label], function(err, key) {
      if (err) return cb(err);
      fhc.config.set(USER_API_KEY, key.key);
      targets.save(key.key);
      return cb(null, key.key);
    });
  } else {
    return cb(undefined, fhc.config.get(USER_API_KEY));
  }
}

userkeys.getUserApiKey = function(){
  return ini.get(USER_API_KEY);
};

userkeys.delUserApiKey = function(){
  ini.del(USER_API_KEY);
};
