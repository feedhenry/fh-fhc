// Simple module allowing users to attempt to initialise a boilerplate app in
// the current directory from a GitHub repository (predefined by us).

"use strict";

var fs = require("fs");
var fstream = require("fstream");
var path = require("path");
var request = require("request");
var unzip = require("unzip");

module.exports = function init(args, callback) {

  // We can rely on the cwd existing and hence not worry about errors.
  // TODO: Allow for hidden files such as .DS_Store.
  var cwdIsEmpty = !(fs.readdirSync(process.cwd()).length);
  if (!cwdIsEmpty) {
    return callback(new Error("Directory must be empty to run init!"));
  }

  // TODO: Add progress indication.
  console.log("Fetching & processing project ZIP from GitHub...");

  // Change this URL based on desired project base.
  request("http://github.com/feedhenry-training/Basic-App/archive/master.zip")
    .pipe(unzip.Parse())
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
      return callback(null, "Project init complete.");
    });
};

// Usage string padding varies; going with local style of surrounding newlines.
exports.usage = "\nfhc init\n";
