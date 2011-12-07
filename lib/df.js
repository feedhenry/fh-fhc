module.exports = df;
df.pingVersion = pingVersion;
df.apps = apps;
df.logs = logs;

df.usage = "\nfhc df ping"
  + "\nfhc df version"
  + "\nfhc df apps"
  + "\nfhc df logs <app id>"
  + "\nfhc df start <app id>"
  + "\nfhc df stop <app id>"
  + "\nfhc df delete <app id>"
  + "\nfhc df act <app id> <server function> <params>"
  + "\nfhc df url <app id> (returns the full DynoFarm url given an appId)";
             
var log = require("./utils/log");
var hash = require("./utils/hash");
var fhc = require("./fhc");
var util = require('util');
var output = require("./utils/output");
var request = require('request');
var common = require('./common.js');
var Table = require('cli-table');
var ini = require('./utils/ini');

// main DynoFarm entry point
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
    case "url":  { 
      if (args.length != 1) return unknown("url", cb);
      else return url(args[0], cb);
    };
    case "act": {
      if (args.length < 2) return unknown("act", cb);
      return act(args[0], args[1], args[2], cb);
    };
    case "delete":  { 
      if (args.length != 1) return unknown("delete", cb);
      else return deleteApp(args[0], cb);
    };
    default: return unknown(action, cb);
  }
};

// gets the app endpoint from the dftarget
function getAppUrl(appId){
  var appName = common.getAppName(appId);
  var df = fhc.config.get("dynofarm");
  var uri = require('url').parse(df);  
  
  // replace 'api' with the modified appId to get our enpoint
  var port = uri.port ? ":" +  uri.port : "";
  var url = uri.protocol + "//" + appName + "." + uri.hostname + port;
  url = url.replace(/\.api\./g, '.');
  
  return url;
}

// our 'act' function
function act(appId, funct, params, cb) {
  var data = {};
  if (params) data = JSON.parse(params);
  log.silly(data, "df act params");

  // firgure out our app endpoint
  var appUrl = getAppUrl(appId);
  log.verbose('' + appUrl, "App endpoint");
  log.verbose('' + funct, "Calling DF function"); 

  // post to /cloud
  request({uri: appUrl + "/cloud/" + funct, method: 'POST', json: data}, function (err, response, body) {
    log.silly(response);
    return cb(nullToUndefined(err), body);
  });
};

// ping 
function pingVersion (pingVersion, cb) {  
  request(getDynoFarmUrl() + "sys/info/" + pingVersion, function (err, response, body) {
    return cb(nullToUndefined(err), body);
  });
};

// put our apps into table format..
function createTableForApps(apps) {
  // calculate widths
  var maxApp=4, maxUser = 5, maxInstance=8, maxPort=5, maxState=5, maxUrl = 3;

  for (var a in apps) {
    var app = apps[a];

    if(common.strlen(app.title) > maxApp) maxApp = common.strlen(app.title);
    if(common.strlen(app.url) > maxUrl) maxUrl = common.strlen(app.url);
    if(common.strlen(app.email) > maxUser) maxUser = common.strlen(app.email);
    if(common.strlen(app.instance) > maxInstance) maxInstance = common.strlen(app.instance);
    if(common.strlen(app.port) > maxPort) maxPort = common.strlen(app.port);
    if(common.strlen(app.state) > maxState) maxState = common.strlen(app.state);   
  }

  // create our table
  df.table = new Table({ 
    head: ['App', 'Url', 'Email', 'Instance', 'Port', 'State'], 
    colWidths: [maxApp+2 , maxUrl+2, maxUser+2, maxInstance+2, maxPort+2, maxState+2],
    style: common.style()
  });
  
  // populate our table
  for (var a in apps) {
    var app = apps[a];
    df.table.push([app.title, app.url, app.email, app.instance, app.port || '-', app.state]);
  }  
}

// DynoFarm apps
function apps (cb) {  
  request(getDynoFarmUrl() + "apps", function (err, response, body) {
    if (err) return cb(nullToUndefined(err));
    var apps;
    try{
      apps = JSON.parse(body);      
    } catch (x) {
      return cb("Error parsing apps: " + util.inspect(x));
    }

    if(ini.get('table') === true) {
      createTableForApps(apps);
    }
  
    return cb(undefined, apps);
  });
};

// DynoFarm logs
function logs(appId, cb) {  
  request(getDynoFarmUrl() + "logs/" + appId, function (err, response, body) {
    return cb(nullToUndefined(err), body);
  });
};

// Stop app
function stop(appId, cb) {  
  request(getDynoFarmUrl() + "stop/" + appId, function (err, response, body) {
    return cb(nullToUndefined(err), body);
  });
};

// Start app
function start(appId, cb) {  
  request(getDynoFarmUrl() + "start/" + appId, function (err, response, body) {
    if(err) return cb(err);

    var app;
    try{
      app = JSON.parse(body);      
    } catch (x) {
      return cb(x);
    }

    if(ini.get('table') === true) {
      df.table = common.createObjectTable(app);    
    }

    return cb(nullToUndefined(err), app);
  });
};

// Restart app
function restart(appId, cb) {  
  request(getDynoFarmUrl() + "restart/" + appId, function (err, response, body) {
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

    return cb(nullToUndefined(err), app);
  });
};

// Given an app id, returns its DynoFarm endpoint
function url(appId, cb) {  
  var appName = common.getAppName(appId);
  var url = getAppUrl(appId);
  return cb(undefined, {name: appName, url:url});
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

// Annoyingly, 'request' returns nulls, the rest of FHC uses undefined, so return undefined to keep
// things consistent.
function nullToUndefined(err) {
  return err == null? undefined: err;
}

// delete an app
function deleteApp(appId, cb) {  
  request({url: getDynoFarmUrl() + "delete/" + appId, method: 'POST'}, function (err, response, body) {
    return cb(nullToUndefined(err), body);
  });
};

// bash completion
df.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "df") argv.unshift("df");
  if (argv.length === 2) {
    var cmds = ["apps", "logs", "start", "stop", "delete", "act", "url", "version"];
    return cb(null, cmds);
  }

  var action = argv[2];
  switch (action) {
    // todo: complete with valid values, if possible.
    case "apps":
    case "logs":
    case "start":
    case "delete":
    case "act":
    case "url":
    case "version":
      return cb(null, Object.keys(types));
    default: return cb(null, []);
  }
};
