// target millicore
module.exports = target;
target.usage = "fhc target" 
            +"\nfhc target <feedhenry url>"
            +"\nfhc target <feedhenry url> <user>"
            +"\nfhc target <feedhenry url> <user> <password>";

var fhc = require("./fhc");
var output = require("./utils/output");
var ini = require("./utils/ini");
var login = require("./login.js");
var targets = require("./targets.js");
var log = require("./utils/log");
var util = require('util');
var version = require('./version.js');

// Main target entry point
function target (args, cb) {
  var targ = fhc.config.get("feedhenry");
  if (args.length == 0){
    return cb(undefined, targ); 
  }

  if (args.length != 1 && args.length > 3)  return cb(target.usage);
  
  // Valiate FeedHenry target can be pinged.. 
  version([args[0]], function(err, data){
    if(err) return cb(err);
    if(data.statusCode !== 200) return cb("Invalid target: " + args[0]);

 // TODO - suboptimal this now that we have 'targets', ini file being saved twice.. REFACTOR
  var where = ini.get("global") ? "global" : "user";
  ini.set('feedhenry', args[0], where);
  ini.save(function(err) {
    if (err) return cb(err);

    if (args.length == 3) {
      return login([args[1], args[2]], cb);
    }else {
      // attempt to set existing target cookie.. 
      var t = {
        target: args[0]
      };
      if(args[1]) t['user'] = args[1];

      log.silly(t, "Getting Target");
      var targ = targets.getTarget(t);
      log.silly(targ, "Got Target");
      if (targ == undefined) {
        ini.del("cookie");
        ini.save(function(err){
          target.message = "Successfully targeted " + args[0];
          return cb(err, args[0]);
        });
      }else {        
        // set username and cookie
        ini.set("username", targ.user, "user");
        ini.set("cookie", targ.cookie, "user");
        ini.save(function(err){
          target.message = "Successfully targeted: " + targ.target + " User: " + targ.user;
          return cb(err, targ);
        });   
      }
   }
   });
  });
};

// bash completion
target.completion = function (opts, cb) {
  var targs = targets.getTargets();
  var tgs = [];
  for (var i=0; i<targs.length; i++) {
    tgs.push(targs[i].target);
  }
  return cb(null, tgs);
};