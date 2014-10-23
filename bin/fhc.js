#!/usr/bin/env node
;(function () { // wrapper in case we're in module_context mode

var path = require("path");
var _ = require('underscore');
var output = require("../lib/utils/output");
var sys = require("../lib/utils/sys");
var fhc = require("../lib/fhc");
var errorHandler = require("../lib/utils/error-handler");
var util = require('util');
var conf = { _exit : true };
var argv = require('yargs').argv;

fhc.argv = argv._;
if (argv._.length > 0){
  fhc.command = _.first(argv._);
  argv._.shift();
}else{
  fhc.command = "help";
}
conf.argv = argv;

// now actually fire up fhc and run the command.
// this is how to use fhc programmatically:
fhc.load(conf, function (err, conf) {
  if (err) return errorHandler(err);

  var cmd = fhc.applyCommandFunction(fhc.command, argv, function(err, data){
    if (err) return errorHandler(err);
    if (data === undefined) {
      output.write("",errorHandler);
    } else {
      console.log(cmd);
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
