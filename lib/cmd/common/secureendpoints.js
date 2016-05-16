/* globals i18n */
module.exports = secureendpoints;
secureendpoints.desc = i18n._("Manage an Apps Secure Endpoints");
secureendpoints.usage =
  "\nfhc secureendpoints [get] <app-id> --env=<environment>"
  + "\nfhc secureendpoints set-default <app-id> <default> --env=<environment>"
  + "\nfhc secureendpoints set-override <app-id> <endpoint> <security> --env=<environment>"
  + "\nfhc secureendpoints remove-override <app-id> <endpoint> --env=<environment>"
  + "\nfhc secureendpoints auditlog <app-id> --env=<environment>"
  + i18n._("\nwhere 'default' can be either 'https' or 'appapikey'")
  + i18n._("\nUse 'fhc appendpoints' to list an Apps endpoints.");

var fhreq = require("../../utils/request");
var common = require("../../common");
var util = require('util');
var ini = require('../../utils/ini');
var Table = require('cli-table');
var _ = require('underscore');

function errorMessageString(action) {
  return util.format(i18n._("Invalid arguments for '%s':"), action);
}

// Main secureendpoints entry point
function secureendpoints(argv, cb) {
  var args = argv._;
  var target = ini.getEnvironment(argv);

  if (args.length === 1) {
    return getSecureEndpoints(args[0], target, cb);
  }

  var action = args[0];
  if (action === 'get') {
    return getSecureEndpoints(args[1], target, cb);
  } else if (action === 'set-default') {
    if (args.length !== 3) {
      return cb(errorMessageString(action) + secureendpoints.usage);
    }
    return setDefault(args[1], args[2], target, cb);
  } else if (action === 'set-override') {
    if (args.length !== 4) {
      return cb(errorMessageString(action) + secureendpoints.usage);
    }
    return setOverride(args[1], args[2], args[3], target, cb);
  } else if (action === 'remove-override') {
    if (args.length !== 3) {
      return cb(errorMessageString(action) + secureendpoints.usage);
    }
    return removeOverride(args[1], args[2], target, cb);
  } else if (action === 'auditlog') {
    return auditLog(args[1], args[2], target, cb);
  } else {
    return cb(util.format(i18n._("Unknown command '%s'. "), action) + i18n._("Usage: ") + secureendpoints.usage);
  }
}

// get secureendpoints
function getSecureEndpoints(appId, env, cb) {
  var payload = {appId: appId, environment: env};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/get", payload, i18n._("Error getting secureendpoints: "), function (err, data) {
    if (err) {
      return cb(err);
    }

    if (ini.get('table') === true) {
      secureendpoints.message = i18n._("App Security: ") + data['default'];
      if (data.overrides) {
        secureendpoints.message = secureendpoints.message + i18n._("\nEndpoint Overrides:");
        secureendpoints.table = createTableForOverrides(data.overrides);
      }
    }
    return cb(undefined, data);
  });
}

// set default secureendpoints
function setDefault(appId, def, env, cb) {
  if (def !== 'https' && def !== 'appapikey') {
    return cb(i18n._("'default' must be 'https' or 'appapikey': ") + secureendpoints.usage);
  }
  var payload = {appId: appId, environment: env};
  payload['default'] = def;
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/setDefault",
                   payload, i18n._("Error setting default secureendpoint: "), cb);
}

// set override
function setOverride(appId, endpoint, security, env, cb) {
  if (security !== 'https' && security !== 'appapikey') {
    return cb(i18n._("'security' must be 'https' or 'appapikey': ") + secureendpoints.usage);
  }
  var payload = {appId: appId, environment: env};
  payload.overrides = {};
  payload.overrides[endpoint] = {
    security: security
  };
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/setOverride",
                   payload, i18n._("Error overriding secureendpoint: "), cb);
}

// remove override
function removeOverride(appId, endpoint, env, cb) {
  var payload = {appId: appId, environment: env, endpoint: endpoint};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/removeOverride",
                   payload, i18n._("Error removing override: "), cb);
}

// get audit log for this apps secure endpoints
function auditLog(appId, filter, env, cb) {
  var payload = {appId: appId, environment: env};
  if (filter) {
    if (typeof filter === "string") {
      try {
        filter = JSON.parse(filter);
      } catch (x) {
        return cb(i18n._("Error parsing json: ") + filter + " - " + util.inspect(filter));
      }
    }
    payload.filter = filter;
  }

  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/auditLog", payload, i18n._("Error getting auditlog: "), function (err, log) {
    if (err) {
      return cb(err);
    }

    if (ini.get('table') === true) {
      secureendpoints.table = createTableForAuditLog(log.list);
    }
    return cb(undefined, log);
  });
}

function createTableForAuditLog(entries) {
  // create our table
  var table = new Table({
    head: ['Event', 'Endpoint', 'Security', 'Updated By', 'Updated When'],
    style: common.style()
  });

  // populate our table
  _.each(entries, function (entry) {
    table.push([entry.event, entry.endpoint, entry.security, entry.updatedBy, entry.updatedWhen]);
  });
  return table;
}

function createTableForOverrides(overrides) {
  // create our table
  var table = new Table({
    head: ['Endpoint', 'Security', 'Updated By', 'Updated When'],
    style: common.style()
  });

  // populate our table
  _.each(overrides, function (entry, endpoint) {
    table.push([endpoint, entry.security, entry.updatedBy, entry.updatedWhen]);
  });
  return table;
}


// bash completion
secureendpoints.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "secureendpoints") {
    argv.unshift("secureendpoints");
  }
  if (argv.length === 2) {
    var cmds = ["get", "set-default", "set-override", "remove-override", "auditlog"];
    if (opts.partialWord !== "l") {
      cmds.push("list");
    }
    return cb(undefined, cmds);
  }

  common.getAppIds(cb);
};
