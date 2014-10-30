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
var argv = process.argv.slice(2);
argv = (argv.length === 0) ? ['help'] : argv;

// now actually fire up fhc and run the command.
// this is how to use fhc programmatically:
fhc.load(conf, function (err, conf) {
  if (err) return errorHandler(err);
  var cmd = fhc.applyCommandFunction(argv, function(err, data){
    if (err) return errorHandler(err);
    if (data === undefined) {
      output.write("",errorHandler);
    } else {
      // display bare if specified
      if (!conf.json && conf.bare && cmd.bare) {
        output.write(cmd.bare, errorHandler);
      }else {
        // display table if both requested and supported..
        if (!conf.json && conf.table && (cmd && cmd.table || (data && data._table))) {
          if (cmd && cmd.message) console.log(cmd.message);
          var table = cmd.table || data._table;
          console.log(table.toString());
          output.write("", errorHandler);
        }else{
          if (data){
            delete data._table;  
          }
          // check if we have a nonjson message
          if(!conf.json && cmd && cmd.message) {
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
