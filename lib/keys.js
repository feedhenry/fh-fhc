module.exports = keys;

keys.usage = "fhc keys user list"
           + "\nfhc keys user create <key-label>"
           + "\nfhc keys user update <key-value> <new-key-label>"
           + "\nfhc keys user revoke <key-value>"
           + "\nfhc keys user target [<key-value>]"
           /*+ "\nfhc keys app  list <app-id>"
           + "\nfhc keys app  create <app-id> <key-label>"
           + "\nfhc keys app  update <app-id> <key-value> <new-key-label>"
           + "\nfhc keys app  revoke <app-id> <key-value>"
           + "\nwhere <app-id> is an app id"*/
           + "\nwhere <key-label> is a tag associated with the key"
           + "\nwhere <key-value> is the value of a key "

var log = require("./utils/log");
var set = require("./set");
var get = require("./get");
var common = require("./common");
var fhreq = require("./utils/request");
var fhc = require("./fhc");
var ini = require('./utils/ini');
var prompt = require('./utils/prompt');
var targets = require('./targets');

var VALID_KEY_TYPES = ["app", "user"];
var VALID_USER_KEY_ACTIONS = ["create", "revoke", "list", "target", "update", "delete"];
var VALID_APP_KEY_ACTIONS = ["create", "revoke", "list", "update", "delete"];
var API_URL = "box/srv/1.1/ide/<domain>/api";
var ENDPOINTS = {
  "create" : API_URL + "/create",
  "revoke" : API_URL + "/revoke",
  "list"   : API_URL + "/list",
  "update"   : API_URL + "/update",
  "delete"   : API_URL + "/delete"
};


function unknown(message, cb){
  return cb( message + "\n" + "Usage: \n" + keys.usage);
}

function keys(args, cb){
  if(args.length < 2){
  	return unknown("Invalid arguments", cb);
  }
  var key_type = args[0];
  if(key_type !== "user") {// && key_type !== "app"){
    return unknown("Invalid keys type " + key_type, cb);
  }
  var action = args[1];
  if("list" === action){
    return listKeys(args, cb);
  } else if("create" === action){
    return createKeys(args, cb);
  } else if("revoke" === action){
    return revokeKeys(args, cb);
  } else if("target" === action){
    return targetKeys(args, cb);
  } else if("update" === action){
    return updateKeys(args, cb);
  } else if("delete" === action){
    return deleteKeys(args, cb);
  } else {
    return unknown("Invalid keys action " + action, cb);
  }
}

function listKeys(args, cb){
  var data = checkArgs(args, cb);
  if(data.error){
    return unknown(data.error, cb);
  }
  doKeys("list", data, function(err, res){
    if(err){
      cb(err);
    } else {
      var r = [];
      for(var i=0;i<res.list.length; i++){
        r.push(formatKey(res.list[i]));
      }
      if(ini.get('table') === true && r) {
        keys.table = common.createListTable({"label": 16, "key": 40, "revoked": 40, "revokedEmail": 24}, r);
      }
      cb(null, r);
    }
  });
}

function createKeys(args, cb){
  var data = checkArgs(args, cb);
  if(data.error){
    return unknown(data.error, cb);
  }
  var key_label = args[3];
  if(args[0] === "user"){
    key_label = args[2];
  }
  if(typeof key_label === "undefined"){
    return unknown("Missing key label.", cb);
  }
  data["label"] = key_label;
  doKeys("create", data, function(err, res){
    if(err){
      cb(err);
    } else {
      cb(null, formatKey(res.apiKey));
    }
  });
}

function updateKeys(args, cb){
  var data = checkArgs(args, cb);
  if(data.error){
    return unknown(data.error, cb);
  }

  var key_label = args[4];
  var key_val = args[3];
  if(args[0] === "user"){
    key_label = args[3];
    key_val = args[2];
  }
  if(typeof key_val === "undefined"){
    return unknown("Missing key value.", cb);
  } else if (typeof key_label === 'undefined') {
    return unknown("Missing key label.", cb);
  }

  // construct data to send
  data["key"] = key_val;
  data["fields"] = {
    "label": key_label
  };

  // call update endpoint with data
  doKeys("update", data, function(err, res){
    if(err){
      cb(err);
    } else {
      cb(null, formatKey(res.apiKey));
    }
  });
}

function deleteKeys(args, cb) {
  var data = checkArgs(args, cb);
  if(data.error){
    return unknown(data.error, cb);
  }

  var key_val = args[3];
  if(args[0] === "user"){
    key_val = args[2];
  }
  if(typeof key_val === "undefined"){
    return unknown("Missing key value.", cb);
  }
  data["key"] = key_val;
  var doDelete = function(){
    doKeys("delete", data, function(err, res){
      if(err){
        cb(err);
      } else {
        cb(null, formatKey(res.apiKey));
      }
    });
  };
  if(keys.skipPrompt){
    doDelete();
  } else {
    prompt("WARNING: The key " + key_val + " will be permanently deleted. Are you sure want to continue ? \n (Y/N):", "", false, function(err, val){
      if(val.toLowerCase() == "y" || val.toLowerCase() == "yes"){
        doDelete();
      } else {
        return cb(null, "Aborted");
      }
    });
  }
}

function revokeKeys(args, cb) {
  var data = checkArgs(args, cb);
  if(data.error){
    return unknown(data.error, cb);
  }

  var key_val = args[3];
  if(args[0] === "user"){
    key_val = args[2];
  }
  if(typeof key_val === "undefined"){
    return unknown("Missing key value.", cb);
  }
  data["key"] = key_val;
  var doRevoke = function(){
    doKeys("revoke", data, function(err, res){
      if(err){
        cb(err);
      } else {
        cb(null, formatKey(res.apiKey));
      }
    })
  }
  if(keys.skipPrompt){
    doRevoke();
  } else {
    prompt("WARNING: The key " + key_val + " will be revoked. Are you sure want to continue ? \n (Y/N):", "", false, function(err, val){
      if(val.toLowerCase() == "y" || val.toLowerCase() == "yes"){
        doRevoke();
      } else {
        return cb(null, "Aborted");
      }
    })
  }
}

function targetKeys(args, cb){
  var key_type = args[0];
  if("app" === key_type){
    return unknown("You can only set key target for the user.", cb);
  }
  var key_val = args[2];
  if(typeof key_val === "undefined"){
    var current_key = fhc.config.get(USER_API_KEY);
    return cb(null, current_key);
  } else {
    set([USER_API_KEY, key_val], function(r){
      return cb(null, key_val);
    });
    targets.save(key_val);
  }
}

function checkArgs(args, cb){
  var key_type = args[0];
  var app_id;
  var data = {type: key_type};
  if(key_type === "app"){
    app_id = args[2];
    var r = checkAppId(app_id, cb);
    if(null != r){
      data['error'] = r;
    } else {
      data["appId"] = app_id;
    }
  }
  return data;
}

function checkAppId(appId, cb){
  var err = null;
  if(typeof appId === "undefined"){
    err = "App Id is missing";
  } else if(appId.length != 24){
    err = "Invalid App Id " + appId;
  }
  return err;
}

function formatKey(input){
  var ret = {};

  for (var key in input) {
    if ((input.hasOwnProperty(key))) {
      if ('revoked' === key && input.revoked != null) {
        ret[key] = new Date(input.revoked);
      } else {
        ret[key] = input[key] || '';
      }
    }
  }

  return ret;
}

function doKeys(action, data, cb){
  var url = ENDPOINTS[action].replace('<domain>', fhc.domain);
  common.doApiCall(fhreq.getFeedHenryUrl(), url, data, "Failed to " + action + " key. ", function(err, res){
    cb(err, res);
  })
}

keys.getUserApiKey = function(){
  return ini.get(USER_API_KEY);
}

keys.delUserApiKey = function(){
  ini.del(USER_API_KEY);
}

keys.KEY_ID = USER_API_KEY;



