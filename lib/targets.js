"use strict";

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
var keys = require('./keys');

fs.exists = fs.exists || path.exists;
fs.existsSync = fs.existsSync || path.existsSync;


// put our apps into table format..
function createTableForTargets(targetz) {
  // calculate widths
  var maxTarget=6, maxUser=4, maxCookie=6, maxApiKey=39;
  var keyId = keys.KEY_ID;

  for (var t in targetz) {
    var targ = targetz[t];
    if(common.strlen(targ.target) > maxTarget) maxTarget = common.strlen(targ.target);
    if(common.strlen(targ.user) > maxUser) maxUser = common.strlen(targ.user);
    if(common.strlen(targ.cookie) > maxCookie) maxCookie = common.strlen(targ.cookie);
    if(common.strlen(targ[keyId]) > maxApiKey) maxApiKey = common.strlen(targ[keyId]);
  }

  // create our table
  targets.table = new Table({
    head: ['Target', 'User', 'Cookie', 'ApiKey'],
    colWidths: [maxTarget +2 , maxUser + 2, maxCookie + 2, maxApiKey + 2],
    style: common.style()
  });
  
  // populate our table
  for (var t in targetz) {
    var targ = targetz[t];
    targets.table.push([targ.target, targ.user ? targ.user : "", targ.cookie ? targ.cookie : "", targ[keyId] ? targ[keyId] : ""]);
  }
}

// get our Targets
function getTargets() {
  var targets = [];
  var targetFile = fhc.config.get("usertargets");
  if (fs.existsSync(targetFile)) {
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
}

// only throws a warning if it fails, purposely doesn't callback..
function save(user, cookie, domain) {
  var o;
  var keyId = keys.KEY_ID;
  if(arguments.length == 1){
    o = {};
    o[keyId] = user;
  } else if(arguments.length == 2 || arguments.length == 3){
    o = {user: user, cookie: cookie, domain: domain};
  }
  saveTarget(o, user);
}

function saveTarget(obj, user) {
  try {
    var targetFile = fhc.config.get("usertargets");
    var target = fhc.config.get("feedhenry");
    if (!target.match(/\/$/)) target = target + '/';
    var t = {target: target, user: user};
    var targets = getTargets();
    if (hasTarget(targets, t)) {
      removeTarget(t, user);
      targets = getTargets();
    }
    for(var i in obj){
      t[i] = obj[i];
    }
    targets.push(t);
 
    var persistTargets = fhc.config.get('persistTargets');
    if (('boolean' === typeof persistTargets && persistTargets) || persistTargets === 'true') {
      fs.writeFileSync(targetFile, JSON.stringify(targets));
    }
  
  } catch (x) {
    log.warn(x);
  }
}

function hasTarget(targets, target) {
  var found = false;
  var keyId = keys.KEY_ID;
  for (var i=0; i<targets.length; i++) {
    var t = targets[i];
    if (t.target === target.target && (t.user === target.user || t[keyId] === target[keyId])) {
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
  var persistTargets = fhc.config.get('persistTargets');
  if (('boolean' === typeof persistTargets && persistTargets) || persistTargets === 'true') {
    fs.writeFileSync(targetFile, JSON.stringify(newTargets));
  }
}