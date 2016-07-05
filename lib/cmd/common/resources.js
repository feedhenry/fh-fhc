/* globals i18n */
module.exports = resources;

resources.desc = i18n._("List resources for a FeedHenry Cloud Environment");
resources.usage = "\n Resources across FeedHenry."
  + "\nfhc resources cache flush --env=<environment>"
  + "\nfhc resources cache set --env=<environment> --type=<percent|size> --value=<value>"
  + i18n._("\ne.g. fhc resources cache flush --env=dev")
  + i18n._("\ne.g. fhc resources cache set --type=percent --value=50 --env=dev")
  + i18n._("\ne.g. fhc resources cache set --type=size --value=524288000 --env=live")
  + i18n._("\nTo set unlimited cache size, use 'fhc cache set --type=size --value=-1'\n");

var fhreq = require("../../utils/request");
var common = require("../../common");
var ini = require('../../utils/ini');
var ngui = require('./ngui.js');
var BASE_URL;

// main resources entry point
function resources(argv, cb) {
  var args = argv._;
  var env = ini.getEnvironment(args, undefined);
  var domain = ini.get('domain', 'user');
  ngui({_: []}, function (err, isNgui) {
    if (err) {
      return cb(err);
    }
    if (isNgui) {
      BASE_URL = "api/v2/resources/" + domain;
    } else {
      BASE_URL = "box/srv/1.1/environments";
    }
    if (args[0] === 'cache') {
      return doCache(args, domain, env, cb);
    }
    return doEnvironmentResources(domain, env, true, cb);
  });
}

function doEnvironmentResources(domain, env, verbose, cb) {
  var url = BASE_URL + '/' + env;
  if (!env) {
    return cb(i18n._('No environment specified. Specify using --env=<environment> flag. Available environments: '));
  }
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, i18n._("Call failed: "), cb);
}

function doCache(args, domain, target, cb) {
  if (args.length !== 2) {
    return cb(i18n._('Invalid arguments - must specify command flush or set.') + resources.usage);
  }
  var action = args[1],
    type, value;
  if (action === 'flush') {
    return doCacheFlush(domain, target, cb);
  } else if (action === 'set') {
    type = ini.get('type');
    value = ini.get('value');
    if (!type || !value) {
      return cb(i18n._('Missing cache set param type or value'));
    }
    return doCacheSet(domain, target, type, value, cb);
  } else {
    return cb(i18n._('Invalid action. \n') + resources.usage);
  }
}

function doCacheFlush(domain, env, cb) {
  var url = BASE_URL + "/" + env + "/cache/flush";
  common.doApiCall(fhreq.getFeedHenryUrl(), url, {env: env}, i18n._("Call failed: "), cb);
}

function doCacheSet(domain, env, type, value, cb) {
  var url = BASE_URL + "/" + env + "/cache/set";
  common.doApiCall(fhreq.getFeedHenryUrl(), url, {
    cache: {
      type: type,
      value: value
    }
  }, i18n._("Call failed: "), cb);
}

// bash completion
resources.completion = function (opts, cb) {
  common.getAppIds(cb);
};
