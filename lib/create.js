
module.exports = create;
create.create = create;

create.usage = "fhc create create <app-title> [<git-repo> <git-branch>]";

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

// Main create entry point
function create (args, cb) {
  if (args.length === 0 || args.length > 4){
    return cb(create.usage);
  }

  var title = args[0];
  var repo = args[1];
  var branch = args[2];
  return doCreate(title, repo, branch, cb);  
};

// create app
function doCreate(appTitle, repo, branch, cb) {
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
    create.message = "\nApp created, id: " + data.guid + "\n";
    if (data.isScmApp && data.isScmPrivate) {
      create.message += "\nDetected a private repository.\n";
      create.message += "Please add the following public key to your repository's authorised keys.\n\n";
      create.message += data.publicKey + "\n\n";
      create.message += "Once added, you can trigger a pull using the following command:\n";
      create.message += "fhc git pull " + data.guid;
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

// bash completion
create.completion = function (opts, cb) {
  common.getAppIds(cb);  
};
