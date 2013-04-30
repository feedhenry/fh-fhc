
module.exports = eventmanage;
eventmanage.usage = 
               "\nfhc event-manage app|domain <id> list [--live]"
              +"\nfhc event-manage app|domain <id> set-level level=info|warning|error enabled=true|false emails=foo@example.com,bar@example.com [--live]"
              +"\nfhc event-manage app|domain <id> set-event-enabled event=app_started|app_stopped enabled=true|false [--live]";

eventmanage.url_eventLogManageList = "/box/srv/1.1/cm/eventlog/manage/list";
eventmanage.url_eventLogManageSetLevel = "/box/srv/1.1/cm/eventlog/manage/setlevel";
eventmanage.url_eventLogManageSetEventEnabled = "/box/srv/1.1/cm/eventlog/manage/seteventenabled";
 
var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('./utils/ini');
var Table = require('cli-table');

// Main secureendpoints entry point
function eventmanage (args, cb) {
  var target = ini.get('live') ? 'live' : 'dev';
  // horrible hack for using as a script, check if the last arg is trying to override target
  if (args[args.length -1] === 'live' || args[args.length -1] === 'dev') {
    target = args[args.length -1];
    args.pop();
  }

  if (args.length < 3) return cb("Invalid arguments:" + eventmanage.usage);

  var app_or_domain =  args[0];
  var id = args[1];
  var action = args[2];

  var argsRemainder = args.slice(3);
  var parsedArgs = common.parseArgs(argsRemainder);

  //need to validate args types for each action
  if (action == 'list') {
    if (args.length !== 3) return cb("Invalid arguments for 'list':" + eventmanage.usage);
    return getEventManageList(app_or_domain, id, target, cb);
  }else if (action === 'set-level'){
    if (args.length !== 6) return cb("Invalid arguments for 'set-level':" + eventmanage.usage);
    return setLevel(app_or_domain, id, parsedArgs.level, parsedArgs.enabled, parsedArgs.emails, target, cb);
  }else if (action === 'set-event-enabled'){
    if (args.length !== 5) return cb("Invalid arguments for 'set-event-enabled':" + eventmanage.usage);
    return setEventEnabled(app_or_domain, id, parsedArgs.event, parsedArgs.enabled, target, cb);
  }else{
    return cb("Unknown command '" + action + "'. Usage: " + eventmanage.usage);
  }
};

function getEventManageList(appOrDomain, id, env, cb) {
  var payload = {scope: appOrDomain, id: id, environment: env};
  common.doApiCall(fhreq.getFeedHenryUrl(), eventmanage.url_eventLogManageList, payload, "Error getting events list: ", function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true) {
      if(data.list) {
        eventmanage.message = eventmanage.message + "\nCloud Events List:"
        eventmanage.table = createTableEventManageList(data.list);
      }
    }
    return cb(undefined, data);
  });
};

function setLevel(appOrDomain, id, level, enabled, emails, env, cb) {
  var payload = {scope: appOrDomain, id: id, level: level, enabled: enabled, emails: emails, environment: env};
  common.doApiCall(fhreq.getFeedHenryUrl(), eventmanage.url_eventLogManageSetLevel, payload, "Error setting event level details: ", function(err, resp){
    if(err) return cb(err);
    return cb(undefined, resp);
  });
};

function setEventEnabled(appOrDomain, id, event, enabled, env, cb) {
  var payload = {scope: appOrDomain, id: id, event: event, enabled: enabled, environment: env};
  common.doApiCall(fhreq.getFeedHenryUrl(), eventmanage.url_eventLogManageSetEventEnabled, payload, "Error setting event details: ", function(err, resp){
    if(err) return cb(err);
    return cb(undefined, resp);
  });
};


function createTableEventManageList(entries) {
//level, event, enabled, environment, emails

  // calculate widths
  var maxLevel=7, maxEvent=11, maxEnabled=5, maxEnvironment=4, maxEmails=15;

  for (var i=0; i<entries.length; i++) {
    var entry = entries[i];
    if(common.strlen(entry.level) > maxLevel) maxLevel = common.strlen(entry.level);
    if(common.strlen(entry.event) > maxEvent) maxEvent = common.strlen(entry.event);
    if(common.strlen(entry.enabled) > maxEnabled) maxEnabled = common.strlen(entry.enabled);
    if(common.strlen(entry.environment) > maxEnvironment) maxEnvironment = common.strlen(entry.environment);
    if(common.strlen(entry.emails) > maxEmails) maxEmails = common.strlen(entry.emails);
  }
 
  // create our table
  var table = new Table({ 
    head: ['Level', 'Event', 'Enabled', 'Environment', 'Emails'],
    colWidths: [maxLevel +2 , maxEvent + 2, maxEnabled + 2, maxEnvironment + 2, maxEmails + 2],
    style: common.style()
  });
  
  // populate our table
  for (var i=0; i<entries.length; i++) {
    var entry = entries[i];
    table.push([entry.level, entry.event, entry.enabled, entry.environment, entry.emails]);
  }
  return table; 
};


// bash completion
eventmanage.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "event-manage") argv.unshift("event-manage");

  if (argv.length === 2) {
    var cmds = ["app", "domain"];
    return cb(undefined, cmds);
  }

  if (argv.length === 4) {
    var cmds = ["list", "set-level", "set-event-enabled"];
    return cb(undefined, cmds);
  }

  if ((argv.length === 3) && (argv[2] === 'app')) {
    return common.getAppIds(cb);
  }

  return cb();
};
