// Simple module allowing users to attempt to initialise a boilerplate app in
// the current directory from a GitHub repository (predefined by us).

"use strict";
/* globals i18n */

// Usage string padding varies; going with local style of surrounding newlines.
exports.usage = "\nfhc init\n";
exports.desc = i18n._("Bootstrap a New Project");

var fs = require("fs");
var fstream = require("fstream");
var path = require("path");
var fhc = require("../../fhc");
var request = require('request');
var unzip = require("unzip");

module.exports = function init(argv, callback) {
  // Ensure the current directory is empty, except for dotfiles or a README.
  var cwdFiles = fs.readdirSync(process.cwd());
  for (var i = 0, l = cwdFiles.length, file; i < l; i++) {
    file = cwdFiles[i];
    if (!(/^\.|^README\./.test(file))) {
      return callback(new Error(i18n._("Directory must be empty to run init!")));
    }
  }

  // We use stream type console output to prevent automatic newline.
  process.stdout.write(i18n._("Fetching project ZIP from GitHub... "));

  var proxyRequest = request.defaults({'proxy': fhc.config.get("proxy")});
  // Change this URL based on desired project base.
  proxyRequest("http://github.com/feedhenry-training/Basic-App/archive/master.zip")
    .on("error", handleError)
    .on("end", function() {
      console.log(i18n._("done!").green);
      process.stdout.write(i18n._("Processing ZIP file... "));
    })

    .pipe(unzip.Parse())
    .on("error", handleError)
    .on("entry", function(item) {
      // If changing base project, also change this to reference top-level dir.
      var fileName = item.path.replace("Basic-App-master/", "");
      if (fileName !== "" && item.type !== "Directory") {
        item.pipe(fstream.Writer(path.join(process.cwd(), fileName)));
      } else {
        item.autodrain();
      }
    })
    .on("close", function() {
      console.log(i18n._("Done!").green);
      return callback(null, i18n._("Project init complete."));
    });

  // Calling the callback with an error will take care of killing the process.
  function handleError(error) {
    console.log(i18n._("Failed!").red);
    return callback(error);
  }
};
