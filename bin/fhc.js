#!/usr/bin/env node
;(function () { // wrapper in case we're in module_context mode

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

fhc.argv = conf.argv.remain;
if (fhc.argv[0]) fhc.command = fhc.argv.shift();
else conf.usage = true;

// make sure that this version of node works with this version of fhc.
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

  var cmd = fhc.getCommandFunction(fhc.command);

  cmd(fhc.argv, function(err, data) {
    if (err) return errorHandler(err);
    if (data === undefined) {
      output.write("",errorHandler);
    } else {
      // display bare if specified
      if (!conf.json && conf.bare && cmd.bare) {
        output.write(cmd.bare, errorHandler);
      }else {
        // display table if both requested and supported..
        if (!conf.json && conf.table && cmd.table) {
          if (cmd.message) console.log(cmd.message);
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
