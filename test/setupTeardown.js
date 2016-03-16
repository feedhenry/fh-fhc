var fhc = require("fhc.js");
var ini = require('utils/ini.js');
exports.setUp = function(finish){
  fhc.load(function (er) {
    ini.set("feedhenry", "https://apps.feedhenry.com");
    ini.set("domain", "apps");
    return finish(er);
  });
};

exports.tearDown = function(finish){
  console.log('Passed');
  return finish();
};
