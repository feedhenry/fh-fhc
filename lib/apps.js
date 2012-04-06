
module.exports = apps;
apps.list = list;
apps.read = read;
apps.stats = stats;
apps.update = update;
apps.create = create;
apps.deleteApps = deleteApps;

apps.usage = "\nfhc apps [list]"
  + "\nfhc apps create <app-title> [<git-repo> <git-branch>]"
  + "\nfhc apps [read] <app-id>"
  + "\nfhc apps stats <deployTarget> <statsType> <numResults> <app id>"
  + "\nfhc apps update <app-id> <property-name> <property-value>"
  + "\nfhc apps delete <app-id>";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var url = require('url');
var https = require('https');
var exec = require("./utils/exec.js");
var millicore = require("./utils/millicore.js");
var ini = require('./utils/ini');
var Table = require('cli-table');

// Main apps entry point
function apps (args, cb) {
  if (args.length == 0){
    return list(cb);
  }

  var action = args[0];
  if (action == 'read') {
    var appId = fhc.appId(args[1]);
    return read(appId, cb);
  } else if (action == 'stats') {
    var deployTarget = args[1];
    var statsType = args[2];
    var numResults = parseInt(args[3]);
    var appId = fhc.appId(args[4]);
    return stats(appId, deployTarget, statsType, numResults, cb);
  } else if (action === 'list') {      
    return list(cb);
  } else if (action === 'create'){
    args.shift();
    if (args.length === 0 || args.length > 4) return cb(apps.usage);
    // TODO order here is important unfortunately.. would be good to have command specific options..
    var title = args[0];
    var repo = args[1];
    var branch = args[2];
    return create(title, repo, branch, cb);
  }else if (action === 'update' || action === 'set'){
    args.shift();
    if (args.length !== 3) return cb(apps.usage);
    var appId = fhc.appId(args[0]);
    var name = args[1];
    var value = args[2];
    return update(appId, name, value, cb);
  }else if (action === 'delete'){
    args.shift();
    var appId = fhc.appId(args);
    return deleteApps(appId, cb);
  } else if (action === 'ping'){
    args.shift();
    var appId = fhc.appId(args[0]);
    var deployTarget = args[1] || null;
    return pingApp(appId, deployTarget, cb);
  } else if (args.length == 1){
    var appId = fhc.appId(args[0]);
    return read(appId, cb);
  }else{
    return cb(apps.usage);
  }
};

// list apps
function list(cb) {
  common.listApps(function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data.list) {
      apps.table = common.createTableForApps(data.list);
    }

    return cb(err, data);
  });
};

// read an app
function read (appId, cb) {  
  if (!appId) return cb("No appId specified! Usage:\n" + apps.usage);

  common.readApp(appId, function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data) {
      apps.table = common.createTableForAppProps(data);
    }

    return cb(err, data);
  });
};

// read app stats
function stats (appId, deployTarget, statsType, numResults, cb) {  
  if (!appId) return cb("No appId specified! Usage:\n" + apps.usage);
  if (!deployTarget) return cb("No deployTarget specified! Usage:\n" + apps.usage);
  if (!statsType) return cb("No statsType specified! Usage:\n" + apps.usage);
  if (!numResults) return cb("No numResults specified! Usage:\n" + apps.usage);

  common.readAppStats(appId, deployTarget, statsType, numResults, function(err, data){
    if(err) return cb(err);
    return cb(err, data);
  });
};

// create app
function create(appTitle, repo, branch, cb) {
  var nodejsEnabled = ini.get('nodejs') === true;
  var params =  {
      title: appTitle,
      height: 300,
      width: 200,
      description: appTitle,
      config: {'nodejs.enabled' : nodejsEnabled}
  };



  if (repo) {
    params.scmurl = repo;
  }

  if (branch) {
    params.scmbranch = branch;
  }

  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/create", params, "Error creating new app: ", function(err, data) {
    if(err) return cb(err);
    log.silly(data, "app create");
    apps.message = "\nApp created, id: " + data.guid + "\n";
    if (data.isScmApp && data.isScmPrivate) {
      apps.message += "\nDetected a private repository.\n";
      apps.message += "Please add the following public key to your repository's authorised keys.\n\n";
      apps.message += data.publicKey + "\n\n";
      apps.message += "Once added, you can trigger a pull using the following command:\n";
      apps.message += "fhc git pull " + data.guid;
    }
    if(data.tasks && data.tasks[0]) {
      async.map([data.tasks[0]], common.waitFor, function(err, results) {
        if(err) return cb(err);
        // note we return the original 'data' here (not the output from the cache polling)
        return cb(err, data);
      });
    }else {
      // TODO: horrible hack, Millicore does not wait for git repos to be staged currently
      // (it returns immediatly), so for now (until issue 5248 is fixed) we wiat a few seconds here before returning)
      if(repo) {
        setTimeout(function(){ return cb(err, data);}, 3000);  
      }else {
        return cb(err, data); 
      }
    }
  });
};

// update app properties
// if the property name is one of our known app property names (e.g. title, description, etc) then 
// we update it specifically. If its not, we add the name/value to the config object.
// Note that git properties are updated through the git command.
function update(appId, name, value, cb) {
  name = name.toLowerCase();
  var knownProps = ['title', 'description', 'width', 'height'];
  if (knownProps.indexOf(name) != -1) {
    setKnownProperty(appId, name, value, cb);
  } else {
    setConfigProperty(appId, name, value, cb);
  }
};

// delete app
function deleteApp(appId, cb) {
  var payload = {payload:{confirmed:"true",guid:appId},context:{}};
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/delete", payload, "Error deleting app: ", function(err, data){
     if (err) return cb(err);
     if (data.inst && data.inst.title) {
       if(!apps.message) apps.message = "";
       apps.message = apps.message + "Deleted: " + data.inst.id + ' - ' + data.inst.title + "\n";
     }
     
     return cb(err, data);
   });
}

function pingApp(appId, deployTarget, cb) {
  var deployTarget = deployTarget || 'dev';
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/ping", {guid: appId, deploytarget: deployTarget}, "Error pinging app: ", function(err, data) {
    if (err) return cb(err);
    log.info("Ping: " + data.ping_status);
    log.silly(data, "ping app");
    return cb(err, data);
  });
}

// delete multiple apps
function deleteApps(appId, cb) {  
  var appIds = [], ai, tempId, tempPayload;
  appIds = 'string' === typeof appId ? [appId] : appId;
  async.map(appIds, deleteApp, function(err, results) {
    cb(err, results);      
  });
}

// set a config object property
function setConfigProperty(appId, k, v, cb) {  
  fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/setconfig", {guid: appId, key: k, value: v},  function (er, remoteData, raw, response) {
    if (er) {
      log.error("Error reading app: " + er);
      cb(er);
    }else {
      if (remoteData.status != 'ok') {          
        return cb(remoteData.messsage, remoteData);
      }  
      apps.message = "Config property set ok";
      return cb(undefined, remoteData);   
    }
  });  
};

// Set one of our known properties..
// Note: although we're just setting properties on the app object, the app update endpoint expects the full config object..
function setKnownProperty(appId, k, v, cb){
  common.readApp(appId, function(err, cfg){
    if (err) return cb(err);

    // the config object returned from readApp is not the expected format for app/update :-(
    var payload = {  "payload": {
        "app": cfg.app.guid,
        "inst": appId,
        "title": cfg.inst.title,
        "description": cfg.inst.description,
        "height": cfg.inst.height,
        "width": cfg.inst.width,
        "config": cfg.inst.config,
        "widgetConfig": cfg.app.config
      }, 
      "context": {}
    };
    
    // update the respective nv pair
    payload.payload[k] = v;

    fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/update", payload,  function (err, remoteData, raw, response) {
      if (err) {
        log.error("Error updating app: " + err);
        cb(err);
      }else {
        apps.message = "Property set ok";
        if (remoteData.status != 'ok') {          
          apps.message = "Error setting property: " + remoteData.message;
          return cb(remoteData.messsage, remoteData);
        }  
        return cb(undefined, remoteData);   
      }
    });
  });  
};

// bash completion
apps.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "apps") argv.unshift("apps");
  if (argv.length === 2) {
    var cmds = ["create", "read", "list", "delete", "rm"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(null, cmds);
  }

  var action = argv[2];
  switch (action) {
    case "delete":
    case "rm":
    case "read":
      common.getAppIds(cb); 
      break;
    case "create":
    case "list": case "ls":
      return cb(null, []);
    default: return cb(null, []);
  }
};
