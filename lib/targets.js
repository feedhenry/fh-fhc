// targets
module.exports = targets;
targets.usage = "fhc targets";
targets.save = save;
targets.getTarget = getTarget;
targets.removeTarget = removeTarget;
targets.getTargets = getTargets;

var log = require("./utils/log");
var fhc = require("./fhc");
var path = require('path');
var ini = require("./utils/ini");
var fs = require('fs');
var util = require('util');
var Table = require('cli-table');
var common = require('./common.js');

// put our apps into table format..
function createTableForTargets(targetz) {
  // calculate widths
  var maxTarget=6, maxUser=4, maxCookie=6;

  for (var t in targetz) {
    var targ = targetz[t];
    if(common.strlen(targ.target) > maxTarget) maxTarget = common.strlen(targ.target);
    if(common.strlen(targ.user) > maxUser) maxUser = common.strlen(targ.user);
    if(common.strlen(targ.cookie) > maxCookie) maxCookie = common.strlen(targ.cookie);   
  }

  // create our table
  targets.table = new Table({ 
    head: ['Target', 'User', 'Cookie'], 
    colWidths: [maxTarget +2 , maxUser + 2, maxCookie + 2],
    style: common.style()
  });
  
  // populate our table
  for (var t in targetz) {
    var targ = targetz[t];
    targets.table.push([targ.target, targ.user, targ.cookie]);
  }  
}

// get our Targets
function getTargets() {
  var targets = [];
  var targetFile = fhc.config.get("usertargets");
  if (path.existsSync(targetFile)) {
    var targetStr = fs.readFileSync(targetFile);
    targets = JSON.parse(targetStr.toString());
  }
  log.silly(targets, "targets");

  if(ini.get('table') === true) {
    createTableForTargets(targets);
  }

  return targets; 
};

function targets (args, cb) {
  var targets = [];
  try {    
    targets = getTargets();
  } catch (x) {
    log.error(x);
    return cb("Error reading file: " + targetFile + " - " + x);
  }
  return cb(undefined, targets);
};

// only throws a warning if it fails, purposely doesn't callback..
function save(user, cookie) {
  try {
    var targetFile = fhc.config.get("usertargets");
    var target = fhc.config.get("feedhenry");
    var targets = getTargets();    
    var t = {target: target, user: user, cookie: cookie};
    if(!hasTarget(targets, t)) {
      log.silly(t, "Adding target");
      targets.push(t);
      fs.writeFileSync(targetFile, JSON.stringify(targets));
    }
  } catch (x) {
    log.warn(x);
  }
}

function hasTarget(targets, target) {
  var found = false;
  for (var i=0; i<targets.length; i++) {
    var t = targets[i];
    if (t.target === target.target && t.user === target.user) {
      found = true;
      break;
    }      
  }
  return found;
}

function getTarget(target) {
  if (!target.target.match(/\/$/)) target.target = target.target + '/';
  var targ = undefined;
  var targets = getTargets();

  for (var i=0; i<targets.length; i++) {
    var t = targets[i];

    if (t.target === target.target){  
      if (target.user != undefined) {
        if(target.user === t.user) {
          targ = t;
          break;
        }
      }else {
        targ = t;
        break;        
      }
    }
  }
  return targ;
}

function removeTarget(target, user) {
  var targets = getTargets();
  var newTargets = [];
  for (var i=0; i<targets.length; i++) {
    var t = targets[i];
    if (t.target !== target && t.user !== user) {
      newTargets.push(t);
    }
  }
  var targetFile = fhc.config.get("usertargets");
  fs.writeFileSync(targetFile, JSON.stringify(newTargets)); 
}