/* globals i18n */
module.exports = alias;
alias.getAlias = getGuidByAlias;
alias.getAliasByGuid = getAliasByGuid;
alias.desc = i18n._("Set an alias for 24 character app id's");
alias.usage = "\nfhc alias <alias>=<guid>";
alias.reserved = ["feedhenry", "cookie", "username"];

var apps = require("../common/apps");
var ini = require("../../utils/ini");
var prompt = require("../../utils/prompt");
var fhc = require("../../fhc");
var _ = require('underscore');
var util = require('util');

function alias(argv, cb) {
  var args = argv._;
  if (args.length !== 1 || args[0].indexOf("=") === -1) return cb(alias.usage);
  var bits = args[0].split("=");
  var ali = bits[0].trim();
  var guid = bits[1].trim();
  guid = fhc.appId(guid);

  //validation
  validateGuid(guid, function (err) {
    if (err)return cb(err);
    validateAlias(ali, function (err) {
      if (err)return cb(err);
      //all good
      var set = ini.set(ali, guid, "user");
      if (set === guid) {
        ini.save(function (err) {
          if (err)return cb(err);
          return cb(undefined, "ok");
        });
      }
      else return cb(i18n._("an error occurred setting the alias"));
    });
  });
}

/**
 *
 * @param guid string 24 character id
 * @param cb function
 * validates the guid passed against the users apps
 */
function validateGuid(guid, cb) {
  apps.list(function (err, data) {
    if (err)return cb(err);

    var max = data.list.length;
    for (var i = 0; i < max; i++) {
      if (data.list[i].id === guid) {
        return cb();
      }
    }
    return cb(i18n._("no guid found"));
  });
}

/**
 *@param ali string
 *@param cb function
 * validates an alias is ok to use
 **/
function validateAlias(ali, cb) {
  var checkedVal;
  if (ali.length > 23) return cb(i18n._("an alias must be less than 24 chars"));

  if (isReserverd(ali)) return cb(util.format(i18n._("%s is reserved"), ali));

  //check to see if the key is already used
  checkedVal = ini.get(ali, "user");
  if (checkedVal) {
    return prompt(util.format(i18n._("the alias %s already exists. Override ? (y/n)"), ali), "", false, function (er, val) {
      if (er) return cb(er);
      if (val.toLowerCase() === "y") {
        return cb();
      } else {
        return cb(i18n._("alias cancelled"));
      }
    });
  }

  return cb();
}

/**
 *
 * @param alias string
 * attempts to find guid via its alias
 */
function getGuidByAlias(alias) {
  return ini.get(alias);
}

function isReserverd(prop) {

  for (var i = 0; i < alias.reserved.length; i++) {
    if (alias.reserved[i] === prop) {
      return true;
    }
  }
  return false;
}

function getAliasByGuid(guid) {
  var alias;
  _.each(ini.userStore, function (g, a) {
    if (guid === g) {
      alias = a;
    }
  });
  return alias;
}
