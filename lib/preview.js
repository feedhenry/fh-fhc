
// Warning: under development!

module.exports = preview;
preview.usage = "\nfhc preview <app id>";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var exec = require("./utils/exec.js");

// main preview entry point
function preview (args, cb) { 
  if (args.length == 1){
    var appId = args[0];
    return doPreview(appId, cb);
  }else {
    return cb(preview.usage);
  }
};

// do the actual preview
function doPreview(appId, cb) {
  var url = fhreq.getFeedHenryUrl() + 'box/srv/1.1/wid/' + fhc.domain + '/studio/' + appId + '/container';
  exec(fhc.config.get("browser"), ["--app=" + url], function(err){
    if(err) {
      log.er(cb,
        "Failed to open "+url+" in a browser.  It could be that the\n"+
        "'browser' config is not set.  Try doing the following:\n"+
        "    fhc config set browser google-chrome\n"+
        "or:\n"+
        "    fhc config set browser lynx\n");
    }else cb();
  });
};
