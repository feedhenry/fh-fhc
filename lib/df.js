module.exports = df;
df.pingVersion = pingVersion;
df.apps = apps;
df.logs = logs;

df.usage = "\nfhc df ping"
  + "\nfhc df version"
  + "\nfhc df apps"
  + "\nfhc df logs <app-name>"
  + "\nfhc df start <app-name>"
  + "\nfhc df stop <app-name>"
  + "\nfhc df delete <app-name>";
             
var log = require("./utils/log");
var hash = require("./utils/hash");
var fhc = require("./fhc");
var util = require('util');
var output = require("./utils/output");
var request = require('request');
var common = require('./common.js');
var Table = require('cli-table');
var ini = require('./utils/ini');
var async = require('async');

// main DynoFarm entry point
// note app-name here is the DF app name, not the Millicore guid (i.e. we talk directly to DF)
function df (args, cb) {
  var action = args.shift();
  switch (action) {    
    case "ping": return pingVersion("ping", cb);
    case "version": return pingVersion("version", cb);
    case "apps": case "ls": return apps(cb);
    case "logs":  { 
      if (args.length != 1) return unknown("logs", cb);
      else return logs(args[0], cb);
    };
    case "stop":  { 
      if (args.length != 1) return unknown("stop", cb);
      else return stop(args[0], cb);
    };
    case "start":  { 
      if (args.length != 1) return unknown("start", cb);
      else return start(args[0], cb);
    };
    case "restart":  { 
      if (args.length != 1) return unknown("restart", cb);
      else return restart(args[0], cb);
    };
    case "delete":  { 
      if (args.length < 1) return unknown("delete", cb);
      else return deleteApps(args, cb);
    };
    default: return unknown(action, cb);
  }
};

// ping 
function pingVersion (pingVersion, cb) {  
  request(getDynoFarmUrl() + "sys/info/" + pingVersion, function (err, response, body) {
    return cb(common.nullToUndefined(err), body);
  });
};

// put our apps into table format..
function createTableForApps(apps) {
  // calculate widths
  var maxTitle=5, maxName=4, maxUser=5, maxPort=5, maxState=5, maxUrl=3;

  for (var a in apps) {
    var app = apps[a];

    if(common.strlen(app.title) > maxTitle) maxTitle = common.strlen(app.title);
    if(common.strlen(app.appname) > maxName) maxName = common.strlen(app.appname);
    if(common.strlen(app.url) > maxUrl) maxUrl = common.strlen(app.url);
    if(common.strlen(app.email) > maxUser) maxUser = common.strlen(app.email);
    if(common.strlen(app.port) > maxPort) maxPort = common.strlen(app.port);
    if(common.strlen(app.state) > maxState) maxState = common.strlen(app.state);   
  }

  // create our table
  df.table = new Table({ 
    head: ['Title', 'Name', 'Url', 'Email', 'Port', 'State'], 
    colWidths: [maxTitle+2 , maxName+2, maxUrl+2, maxUser+2, maxPort+2, maxState+2],
    style: common.style()
  });
  
  // populate our table
  for (var a in apps) {
    var app = apps[a];
    df.table.push([app.title, app.appname, app.url, app.email, app.port || '-', app.state]);
  }  
}

// DynoFarm apps
function apps (cb) {  
  request(getDynoFarmUrl() + "apps", function (err, response, body) {
    if (err) return cb(common.nullToUndefined(err));
    var apps;
    try{
      apps = JSON.parse(body);      
    } catch (x) {
      return cb("Error parsing apps: " + util.inspect(x, true, null) + " body: " + util.inspect(body));
    }

    if(ini.get('table') === true) {
      createTableForApps(apps);
    }
  
    return cb(undefined, apps);
  });
};

// DynoFarm logs
function logs(appName, cb) {  
  request(getDynoFarmUrl() + "logs/" + appName, function (err, response, body) {
    return cb(common.nullToUndefined(err), body);
  });
};

// Stop app
function stop(appName, cb) {  
  request(getDynoFarmUrl() + "stop/" + appName, function (err, response, body) {
    return cb(common.nullToUndefined(err), body);
  });
};

// Start app
function start(appName, cb) {  
  request(getDynoFarmUrl() + "start/" + appName, function (err, response, body) {
    if(err) return cb(err);

    var app;
    try{
      app = JSON.parse(body);      
    } catch (x) {
      log.error("Error parsing: " + body);
      return cb(x);
    }

    if(ini.get('table') === true) {
      df.table = common.createObjectTable(app);    
    }

    return cb(common.nullToUndefined(err), app);
  });
};

// Restart app
function restart(appName, cb) {  
  request(getDynoFarmUrl() + "restart/" + appName, function (err, response, body) {
    if(err) return cb(err);
    if(response.statusCode !== 200) return cb("Bad response: " + response.statusCode + " " + body);
    var app;
    try{
      app = JSON.parse(body);      
    } catch (x) {
      return cb("Error parsing app: " + util.inspect(body) + " error: " + util.inspect(x));
    }

    if(ini.get('table') === true) {
      df.table = common.createObjectTable(app);    
    }

    return cb(common.nullToUndefined(err), app);
  });
};

function unknown (action, cb) {  
  var msg = action ? "Wrong arguments for or unknown action: " + action + "\n" : "";
  msg += "Usage:\n" + df.usage;
  cb(msg);
};

// get our DF endpoint
function getDynoFarmUrl () {
  var r = fhc.config.get("dynofarm");
  if (!r) {
    return new Error("Must define DynoFarm URLs before accessing FeedHenry DynoFarm Server.")
  }
  if (r.substr(-1) !== "/") r += "/";
  fhc.config.set("dynofarm", r);    
  return r;
};

// delete an app
function deleteApp(appName, cb) {  
  request({url: getDynoFarmUrl() + "delete/" + appName, method: 'POST'}, function (err, response, body) {
    return cb(common.nullToUndefined(err), body);
  });
};

function deleteApps(apps, cb) {    
  async.map(apps, deleteApp, cb);
};

// bash completion
df.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "df") argv.unshift("df");
  if (argv.length === 2) {
    var cmds = ["apps", "logs", "start", "stop", "delete", , "version"];
    return cb(null, cmds);
  }

  var action = argv[2];
  switch (action) {
    // todo: complete with valid values, if possible.
    case "apps":
    case "logs":
    case "start":
    case "delete":
    case "version":
      return cb(null, Object.keys(types));
    default: return cb(null, []);
  }
};
