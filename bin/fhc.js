#!/usr/bin/env node
;(function () { // wrapper in case we're in module_context mode
var log = require("../lib/utils/log");
log.waitForConfig();
log.info("ok", "it worked if it ends with");

var fs = require("fs");
var path = require("path");
var output = require("../lib/utils/output");
var sys = require("../lib/utils/sys");
var fhc = require("../lib/fhc");
var ini = require("../lib/utils/ini");
var errorHandler = require("../lib/utils/error-handler");
var configDefs = require("../lib/utils/config-defs");
var shorthands = configDefs.shorthands;
var types = configDefs.types;
var nopt = require("nopt");
var util = require('util');
var conf = nopt(types, shorthands);

//log.verbose(process.argv, "cli");

fhc.argv = conf.argv.remain;
if (fhc.deref(fhc.argv[0])) fhc.command = fhc.argv.shift();
else conf.usage = true;

if (conf.version) {
  console.log(fhc.version);
  return;
} else {
  log("fhc@"+fhc.version, "using");
}

log("node@"+process.version, "using");

// make sure that this version of node works with this version of fhc.
var semver = require("semver");
var nodeVer = process.version;
var reqVer = fhc.nodeVersionRequired;

if (reqVer && !semver.satisfies(nodeVer, reqVer)) {
  return errorHandler(new Error("fhc doesn't work with node " + nodeVer + "\nRequired: node@" + reqVer), true);
}

process.on("uncaughtException", errorHandler);

if (conf.usage && fhc.command !== "help") {
  fhc.argv.unshift(fhc.command);
  fhc.command = "help";
}

// now actually fire up fhc and run the command.
// this is how to use fhc programmatically:
conf._exit = true;
fhc.load(conf, function (err) {  
  if (err) return errorHandler(err);

  var cmd = fhc.commands[fhc.command];
  cmd(fhc.argv, function(err, data) {
    if (err) return errorHandler(err);

    // special output for apps logs. TODO still should be able to get json output for logs via by setting a flag.. 
    if ("logs" === fhc.command && fhc.argv[0] != undefined) {
      var logData = "\n====> stdout <====\n" +  data.logs.stdout + "\n====> stderr <====\n" + data.logs.stderr;
      output.write(logData, errorHandler); 
    }else {
      if (data === undefined) {
        output.write("",errorHandler);     
      }        
      else {
        // display table if both requested and supported.. 
        if (!conf.json && conf.table && cmd.table) {
          console.log(cmd.table.toString());
          output.write("", errorHandler);
        }else {
          // check if we have a nonjson message
          if(!conf.json && cmd.message) {
            output.write(cmd.message, errorHandler);
          }else {
            if (typeof data === 'string') return output.write(data, errorHandler);
            if (conf.filter) {
              var script = "output.write(data." + conf.filter + ", errorHandler)"; 
              eval(script);
            }else{
              return output.write(data, errorHandler);
            }
          }
        }
      }        
    }
  });
})
})()
