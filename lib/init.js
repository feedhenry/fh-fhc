// Simple module allowing users to attempt to initialise a boilerplate app in
// the current directory from a GitHub repository (predefined by us).

"use strict";

var colors = require("colors");
var fs = require("fs");
var fstream = require("fstream");
var path = require("path");
var fhc = require("./fhc");
var request = require('request').defaults({'proxy': fhc.config.get("proxy")});
var unzip = require("unzip");

module.exports = function init(args, callback) {

  // Ensure the current directory is empty, except for dotfiles or a README.
  var cwdFiles = fs.readdirSync(process.cwd());
  for (var i = 0, l = cwdFiles.length, file; i < l; i++) {
    file = cwdFiles[i];
    if (!(/^\.|^README\./.test(file))) {
      return callback(new Error("Directory must be empty to run init!"));
    }
  }

  // We use stream type console output to prevent automatic newline.
  process.stdout.write("Fetching project ZIP from GitHub... ");

  // Change this URL based on desired project base.
  request("http://github.com/feedhenry-training/Basic-App/archive/master.zip")
    .on("error", handleError)
    .on("end", function() {
      console.log("done!".green);
      process.stdout.write("Processing ZIP file... ");
    })

    .pipe(unzip.Parse())
    .on("error", handleError)
    .on("entry", function(item) {
      // TODO: Add some logging for verbose level.

      // If changing base project, also change this to reference top-level dir.
      var fileName = item.path.replace("Basic-App-master/", "");

      if (fileName !== "" && item.type !== "Directory") {
        item.pipe(fstream.Writer(path.join(process.cwd(), fileName)));
      } else {
        item.autodrain();
      }
    })
    .on("close", function() {
      console.log("done!".green);
      return callback(null, "Project init complete.");
    });

  // Calling the callback with an error will take care of killing the process.
  function handleError(error) {
    console.log("failed!".red);
    return callback(error);
  }
};

// Usage string padding varies; going with local style of surrounding newlines.
exports.usage = "\nfhc init\n";
