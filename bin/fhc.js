#!/usr/bin/env node
(function () { // wrapper in case we're in module_context mode
  var fhc = require("../lib/fhc");
  var errorHandler = require("../lib/utils/error-handler");
  var cmdCompletion = require("../lib/utils/cmd-completion");
  var resultHandler = require("../lib/utils/result-handler");

  var conf = {_exit: true};
  var argv = process.argv.slice(2);
  argv = (argv.length === 0) ? ['help'] : argv;

  fhc.load(conf, function (err, conf) {
    cmdCompletion.setup();
    if (err) return errorHandler(err);
    var cmd = fhc.applyCommandFunction(argv, function (err, data) {
      resultHandler.printCommandResult(err, data,conf,cmd);
    });
  });
})();
