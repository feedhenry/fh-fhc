module.exports = logs;
logs.logs = logs;
logs.listLogs = listLogs;
logs.getLogs = getLogs;
logs.usage =  "\nfhc logs [get] <app-id> [log-name] [--env=<environment>]"
            + "\nfhc logs tail <app-id> [last-N-lines] [offset-from] [log-name] [--env=<environment>]"
            + "\nfhc logs list <app-id> [--env=<environment>]"
            + "\nfhc logs delete <app-id> <log-name> [--env=<environment>]";
            + "\n"
            + "\n Note: log tail defaults to the current std-out log file & display last 1000 lines of log file"
            + "\n       To specify an offset, pass -1 for the last-N-lines param - e.g. "
            + "\n           log tail -1 12345"
            + "\n       This will return all log entries from position 12345 onwards";
var log = require("./utils/log");
var fhc = require("./fhc");
var common = require("./common");
var util = require('util');
var ini = require('./utils/ini');
var fhreq = require("./utils/request");
var Table = require('cli-table');
var request = require('request');
var fs = require('fs');
var https = require('https');

// main logs entry point
function logs(args, cb) {

  if (args.length < 1) return cb(logs.usage);
  var target = ini.getEnvironment(args, 'development');


  // Otherwise look for an action
  var action = args[0];
  if (action === "get") {
      if (!args[1]) return cb(logs.usage);
      var appId = fhc.appId(args[1]);
      var logName = args[2];
      return getLogs(appId, logName, target, cb);
  } else if (action === "tail") {
    if (!args[1]) return cb(logs.usage);
    var appId = fhc.appId(args[1]);
    var last = args[2];
    var offset = args[3];
    var logName = args[4];
    return tailLog(process.stdout, appId, last, offset, logName, target, cb);
  } else if (action === "list") {
    if (!args[1]) return cb(logs.usage);
    var appId = fhc.appId(args[1]);
    return listLogs(appId, target, cb);
  }else if (action === "delete") {
    if (!args[1]) return cb(logs.usage);
    if (!args[2]) return cb(logs.usage);
    var appId = fhc.appId(args[1]);
    return deleteLog(appId, args[2], target, cb);
  }else {
    // assume all params are for get
      var appId = fhc.appId(action);
      if(appId.length !== 24) return cb(logs.usage);
      var logName = args[1];
      return getLogs(appId, logName, target, cb);
  }
}

// get our log files
function listLogs (appId, target, cb) {
  var payload = {payload:{guid: appId, deploytarget: target, action: 'list'}};
  log.silly(payload, 'Listing logs');
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/logs", payload,"Error getting logs: ", function(err, data){
    if(err) return cb(err);
    if(ini.get('table') === true) {
      createTableForLogs(data.logs);
    }
    return cb(err, data);
  });
}

// get list of log files
function getLogs (appId, logName, target, cb) {
  var payload = {payload:{guid: appId, deploytarget: target, logname: logName, 'action': 'get'}};
  log.silly(payload, 'Getting logs');
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/logs", payload, "", function(err, data){
    if(err) return cb(err);
    log.silly(data, "Response log");
    if(!logName) {
      // backward compatability..
      var lg = data.log ? data.log: data.logs;
      var logData = "\n====> stdout <====\n" + lg.stdout + "\n====> stderr <====\n" + lg.stderr;
      logs.message = logData;
    }else {
      logs.message = data.log.contents === '' ? '<empty>' : data.log.contents;
    }
    return cb(err, data);
  });
}

// delete log file
function deleteLog (appId, logName, target, cb) {
  var payload = {payload:{guid: appId, deploytarget: target, action: 'delete', logname: logName}};
  log.silly(payload, 'Deleting log');
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/logs", payload,"Error deleting log: ", function(err, data){
    if(err) return cb(err);
    logs.message = JSON.parse(data.msg);
    return cb(err, data);
  });
}

// put our logs into table format..
function createTableForLogs(logz) {
  // calculate widths
  var maxName=4, maxSize=4, maxModified=8;
  var dateFormat = "ddd MMM dd yyyy HH:mm:ss";
  for (var l in logz) {
    var log = logz[l];
    var dt = new Date(log.modified);
    if(common.strlen(log.name) > maxName) maxName = common.strlen(log.name);
    if(common.strlen(log.size) > maxSize) maxSize = common.strlen(log.size);
    if(common.strlen(dt.toString()) > maxModified) maxModified = common.strlen(dt.toString(dateFormat));
  }

  // create our table
  logs.table = new Table({
    head: ['Name', 'Size', 'Modified'],
    colWidths: [maxName +2 , maxSize + 2, maxModified + 2],
    style: common.style()
  });

  // populate our table
  for (var l in logz) {
    var log = logz[l];
    logs.table.push([log.name, log.size, new Date(log.modified).toString(dateFormat)]);
  }
}

//
// Stream log file
// Note this purposely doesn't return json or set the .message property (unlike practically all other calls)
// Instead this streams the requested log file straight to another stream (file currently)
//
// function streamLog(appId, logName, outputFile, target, cb) {
//   if(!logName) return cb("please specify which logfile to stream");
//   // first get app hosts
//   common.getAppNameUrl(appId, target, function(err, appName, appUrl) {
//     if(err) return cb(err);
//     if(!appName) return cb(appId + " not found..");

//     // TODO - check if no appName/appUrl found - errors not streaming properly from Request

//     var url = appUrl.replace(appName, 'api');
//     var fullUrl = url + "/streamlog/" + appName + "/" + logName;
//     var hosturl = url.replace("https://","");
//     var logrequest  = {
//        host : hosturl,
//        path : "/streamlog/" + appName + "/" + logName,
//        method : 'GET',
//        port : 443
//      };

//     var sstream = (outputFile) ? fs.createWriteStream(outputFile) : undefined;

//     var req = https.request(logrequest, function(res){
//       res.setEncoding('utf8');
//       if(res.statusCode === 404){
//         return cb("no logfile found");
//       }

//       res.on('data',function (chunk) {
//         if(sstream === undefined){
//           process.stdout.write(chunk);
//         }else {
//           sstream.write(chunk);
//         }
//       });

//       res.on('end',function (){
//           if(sstream){
//             sstream.end();
//             return cb(undefined, "log written "+outputFile);
//           }else{
//             return cb(undefined, "-- END --");
//           }
//       });
//     });

//     req.on('error',function(err){
//        return cb(err.message);
//     });

//     req.end();
//   });
// };

function logChunk(appName, last, offset, logName, cb) {
  var payload = {
    "last":last,
    "offfset":offset
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/logchunk", payload, "", function(err, data) {
    return cb(err, data);
  });
}

function tailLog(stream, appName, last, offset, logName, target, cb) {
  var payload = {
    "guid": appName,
    "action": "chunk",
    "deploytarget": target
  };

  if( last ) payload.last = last;
  if( offset ) payload.offset = offset;
  if( logName ) payload.logname = logName;

  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/logchunk", payload, "", function(err, res) {
    if(err) return cb(err);

    var lastOffset = res.msg ? res.msg.offset : undefined;
    if( "undefined" === typeof(lastOffset)) {
      return cb("offset undefined");
    }

    if( res.msg.data.length > 0 ) {
      stream.write(res.msg.data.join("\n") + "\n");
    }

    // Check for new logs every 1 second
    setTimeout(function() {
      tailLog(stream, appName, undefined, lastOffset, logName, target, function(err, res) {
        if (err) cb(err);
      });
    }, 1000);
  });
}

// bash completion
logs.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "logs") argv.unshift("logs");
  if (argv.length === 2) {
    var cmds = ["get", "list", "delete"];
    return cb(undefined, cmds);
  }

  var action = argv[2];
  switch (action) {
    case "get":
    case "list":
      common.getAppIds(cb);
      break;
    default: return cb(undefined, []);
  }
};
