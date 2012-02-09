
// Warning: under development!

module.exports = preview;
preview.usage = "\nfhc preview url <app-id>"
               +"\nfhc preview [show] <app-id>"; 

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var exec = require("./utils/exec.js");

// main preview entry point
function preview (args, cb) { 
  if (args.length == 0 || args.length > 3) return cb(preview.usage);

  var action = args[0];
  if (action === 'url') {
    var appId = fhc.appId(args[1]);
    preview.message = getUrl(appId);
    return cb(undefined, {url: getUrl(appId)});    
  }else if (action === 'show') {
    if (!args[1]) return cb(preview.usage);
    var appId = fhc.appId(args[1]);
    preview.message = getUrl(appId);
    return doPreview(appId, cb);
  }

  if (args.length == 1){
    var appId = fhc.appId(action);
    if(appId.length !== 24) return cb(logs.usage);
    preview.message = getUrl(appId);
    return doPreview(appId, cb);
  }else {
    return cb(preview.usage);
  }
};

function getUrl(appId) {
  return fhreq.getFeedHenryUrl() + 'box/srv/1.1/wid/' + fhc.domain + '/studio/' + appId + '/container';
};

// do the actual preview
function doPreview(appId, cb) {
  var url = getUrl(appId);
  exec(fhc.config.get("browser"), [url], function(err){
    if(err) {
      log.er(cb,
        "Failed to open "+url+" in a browser.  It could be that the\n"+
        "'browser' config is not set.  Try doing the following:\n"+
        "    fhc set browser google-chrome\n"+
        "or:\n"+
        "    fhc set browser lynx\n");
    }else cb(undefined, {url: url});
  });
};

// bash completion
preview.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "preview") argv.unshift("preview");
  if (argv.length === 2) {
    var cmds = ["show", "url"];
    return cb(null, cmds);
  }

  var action = argv[2];
  switch (action) {
    case "show":
    case "url":
      common.getAppIds(cb); 
      break;
    default: return cb(null, []);
  }
};
