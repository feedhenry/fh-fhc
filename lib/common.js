// Misc common functions..
var util = require('util');
var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var Table = require('cli-table');
var ini = require('./utils/ini');
var alias = require("./cmd/fh2/alias");
var moment = require("moment");
var _ = require("underscore");

// TODO split into smaller modules with specific role.

// Common API call to FeedHenry
exports.doApiCall = function (host, uri, payload, errorMsg, cb) {
  fhreq.POST(host, uri, payload, function (err, remoteData, raw) {
    if (err) {
      return cb(err);
    }
    if (!remoteData) {
      return cb("No remoteData returned. Raw response is: " + util.inspect(raw));
    }
    if (remoteData.msg !== undefined && remoteData.address !== undefined) {
      if (remoteData.address["login-status"] === 'none') {
        return cb("Error, check your login details.. \n" + remoteData.msg);
      }
    }

    if (remoteData.status !== undefined && remoteData.status !== 'ok') {
      var msg = remoteData.message || remoteData.msg || util.inspect(remoteData);
      return cb(errorMsg + msg, remoteData);
    }
    return cb(undefined, remoteData);
  });
};

exports.doPutApiCall = function (host, uri, payload, cb) {
  fhreq.PUT(host, uri, payload, function (err, remoteData, raw, response) {
    if (err) {
      return cb(err);
    }
    if (!remoteData) {
      return cb("No remoteData returned. Raw response is: " + util.inspect(raw));
    }
    if (remoteData.msg !== undefined && remoteData.address !== undefined) {
      if (remoteData.address["login-status"] === 'none') {
        return cb("Error, check your login details.. \n" + remoteData.msg);
      }
    }

    if (response.statusCode !== 200) return cb(raw);

    if (remoteData.status !== undefined && remoteData.status !== 'ok') {
      var msg = remoteData.message || remoteData.msg;
      return cb(msg, remoteData);
    }
    return cb(undefined, remoteData);
  });
};

exports.doGetApiCall = function (host, uri, errorMsg, cb) {
  fhreq.GET(host, uri, function (err, remoteData, raw, response) {
    if (err) {
      return cb(err);
    }
    if (!remoteData) {
      return cb("No remoteData returned. Raw response is: " + util.inspect(raw));
    }
    if (remoteData.msg !== undefined && remoteData.address !== undefined) {
      if (remoteData.address["login-status"] === 'none') {
        return cb("Error, check your login details.. \n" + remoteData.msg);
      }
    }

    if (response.statusCode !== 200) return cb(raw);

    if (remoteData.status !== undefined && remoteData.status !== 'ok') {
      var msg = remoteData.message || remoteData.msg;
      return cb(errorMsg + msg, remoteData);
    }
    return cb(undefined, remoteData, response.status);
  });
};

exports.doDeleteApiCall = function (host, uri, payload, errorMsg, cb) {
  fhreq.DELETE(host, uri, payload, function (err, remoteData, raw) {
    if (err) {
      return cb(err);
    }
    if (!remoteData) {
      return cb("No remoteData returned. Raw response is: " + util.inspect(raw));
    }
    if (remoteData.msg !== undefined && remoteData.address !== undefined) {
      if (remoteData.address["login-status"] === 'none') {
        return cb("Error, check your login details.. \n" + remoteData.msg);
      }
    }

    if (remoteData.status !== undefined && remoteData.status !== 'ok') {
      var msg = remoteData.message || remoteData.msg;
      return cb(errorMsg + msg, remoteData);
    }
    return cb(undefined, remoteData);
  });
};
// END api calls

exports.getAppContainer = function (appId, cb) {
  var uri = 'box/srv/1.1/wid/' + fhc.curTarget + '/studio/' + appId + '/container';

  fhreq.GET(fhreq.getFeedHenryUrl(), uri, function (err, remoteData, raw, response) {
    if (err) {
      return cb(err);
    }
    if (response.statusCode === 404) {
      return cb('"Error, check app is deployed and guid is correct...', null);
    }
    return cb(undefined, raw);
  });
};

// Poll remote job until its finished
exports.waitForJob = function (cacheKey, start, cb) {
  var wantJson = ini.get('json');
  setTimeout(function () {
    log.silly("polling for cacheKey: " + cacheKey + " start: " + start + " to complete", "Polling");
    var cc = {};
    cc.cacheKey = cacheKey;
    cc.start = start;
    var params = [cc];

    var uri = 'box/srv/1.1/dat/log/read?cacheKeys=' + JSON.stringify(params);
    uri = uri.replace(/"/g, '%22');
    fhreq.GET(fhreq.getFeedHenryUrl(), uri, function (err, remoteData) {

      if (err) {
        return cb(err);
      }
      if (remoteData[0] && remoteData[0].status !== undefined && remoteData[0].status === 'pending') {
        log.silly(remoteData[0].log, "waitforjob");
        start++;
        if (!wantJson) {
          if (remoteData[0].progress) {
            console.log("Progress: " + remoteData[0].progress + "%");
          } else {
            process.stdout.write('.');
          }
        }
        return exports.waitForJob(cacheKey, start++, cb);
      } else {
        if (remoteData[0] && remoteData[0].status && remoteData[0].status === 'error') {
          return cb(remoteData);
        } else {
          return cb(undefined, remoteData);
        }
      }
    });
  }, 3000);
};

// gets our app name via 'hosts' api
exports.getAppNameUrl = function (appId, env, cb) {
  exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/hosts", {payload: {guid: appId}}, "", function (err, data) {
    if (err) {
      return cb(err);
    }
    log.silly(data, "hosts");
    return cb(undefined, data.hosts[env + '-name'], data.hosts[env + '-url']);
  });

};

// common strlen function
function strlen(str) {
  var s = str;
  if (typeof str === 'number') {
    s = "" + str;
  }
  if (typeof str === 'object') {
    s = util.inspect(str);
  }

  var len = 0;
  if (s) {
    len = s.length;
  }
  return len;
}

// used in conjunction with async.map to wait for multiple jobs to finish
exports.waitFor = function (key, cb) {
  exports.waitForJob(key, 0, cb);
};

//region Tables

// common style for all our tables
exports.style = function () {
  var color = ini.get('thcolor') || 'green';
  var ret = {
    'padding-left': 1,
    'padding-right': 1,
    head: [color]
  };
  return ret;
};

// put our apps into table format..
exports.createTableForApps = function (apps) {
  // calculate widths
  var maxId = 4, maxTitle = 5, maxDescription = 11, maxAlias = 5;

  _.each(apps, function (app) {
    if (!app.id) {
      app.id = app.guid;
    }
    var ali = alias.getAliasByGuid(app.id);
    app.alias = ali || "";

    if (strlen(app.alias) > maxAlias) {
      maxAlias = strlen(app.alias);
    }
    if (strlen(app.id) > maxId) {
      maxId = strlen(app.id);
    }
    if (strlen(app.title) > maxTitle) {
      maxTitle = strlen(app.title);
    }
    if (strlen(app.description) > maxDescription) {
      maxDescription = strlen(app.description);
    }
  });

  if (maxDescription > exports.maxTableCell) {
    maxDescription = exports.maxTableCell;
  }
  if (maxTitle > exports.maxTableCell) {
    maxTitle = exports.maxTableCell;
  }

  var table = new Table({
    head: ['ID', 'Title', 'Description', 'Alias'],
    colWidths: [maxId + 2, maxTitle + 2, maxDescription + 2, maxAlias + 2],
    style: exports.style()
  });

  _.each(apps, function (ap) {
    table.push([ap.id, ap.title, ap.description, ap.alias]);
  });
  return table;
};

/**
 * A Table For Listing Data Sources
 * @param dataSources
 */
exports.createTableForDataSources = function(dataSources, service){
  var table = new Table({
    head: ['ID', 'Name', 'Service ID', 'Service Title', 'Endpoint', 'Refresh Interval', 'Number Of Audit Logs'],
    style: exports.style()
  });

  dataSources = _.isArray(dataSources) ? dataSources : [dataSources];

  _.each(dataSources, function (dataSource) {
    var title = service && service.title ? service.title : dataSource.service.title;
    table.push([dataSource._id, dataSource.name, dataSource.serviceGuid, title, dataSource.endpoint, moment.duration(dataSource.refreshInterval, 'minutes').humanize(), dataSource.numAuditLogEntries]);
  }, this);

  return table;
};

/**
 * Creating A Table For Displaying Data Source Audit Logs
 * @param dataSource
 * @param options
 *  - limit: Limiting number of data sources displayed
 */
exports.createTableForEnvDataSourcesAuditLogs = function(dataSource, options){
  var table = new Table({
    head: ['Service ID', 'Service Name', 'Endpoint', 'Status', 'Error', 'Data Length', 'Data Hash', 'Refresh Timestamp'],
    style: exports.style()
  });

  var auditLogs = dataSource.auditLogs || [];

  _.each(_.first(auditLogs, options.limit || auditLogs.length), function (dsAuditLogEntry) {
    var currentStatus = dsAuditLogEntry.currentStatus;
    var errorMsg = currentStatus.error && currentStatus.error.userDetail ? currentStatus.error.userDetail : "NONE";
    var dataLength = dsAuditLogEntry.data ? dsAuditLogEntry.data.length : 0;
    var dataHash = dsAuditLogEntry.dataHash || "NONE";
    table.push([dsAuditLogEntry.service.guid, dsAuditLogEntry.service.title, dsAuditLogEntry.endpoint, currentStatus.status, errorMsg, dataLength, dataHash, moment(dsAuditLogEntry.updateTimestamp).fromNow()]);
  });

  return table;
};


/**
 * A Table Describing Data Sources Deployed To An Environment
 * @param dataSources
 */
exports.createTableForEnvDataSources = function(dataSources){
  var table = new Table({
    head: ['ID', 'Name', 'Service ID', 'Service Name', 'Endpoint', 'Status', 'Error', 'Data Length', 'Last Refreshed'],
    style: exports.style()
  });

  dataSources = _.isArray(dataSources) ? dataSources : [dataSources];

  _.each(dataSources, function (dataSource) {

    var currentStatus = dataSource.currentStatus;
    var errorMsg = currentStatus.error && currentStatus.error.userDetail ? currentStatus.error.userDetail : "NONE";
    var dataLength = dataSource.data ? dataSource.data.length : 0;

    table.push([dataSource._id, dataSource.name, dataSource.service.guid, dataSource.service.title, dataSource.endpoint, currentStatus.status, errorMsg, dataLength, moment(dataSource.lastRefreshed).fromNow()]);
  }, this);

  return table;
};

/**
 * Creating A Data Table For Validation Of Data Sources
 * @param dataSources
 */
exports.createTableForEnvDataSourcesValidation = function(dataSources){
  var table = new Table({
    head: ['Name', 'Service ID', 'Service Name', 'Endpoint', 'Valid', 'Message', 'Data Length'],
    style: exports.style()
  });

  dataSources = _.isArray(dataSources) ? dataSources : [dataSources];

  _.each(dataSources, function (dataSource) {

    var validationResult = dataSource.validationResult;
    var dataLength = dataSource.data ? dataSource.data.length : 0;

    table.push([dataSource.name, dataSource.service.guid, dataSource.service.title, dataSource.endpoint, validationResult.valid, validationResult.message, dataLength]);
  }, this);

  return table;
};

exports.createTableForProjectApps = function (project, apps) {
  var table = new Table({
    head: ['Project ID', 'ID', 'Title', 'Type', 'Last Modified'],
    style: exports.style()
  });

  _.each(apps, function (app) {
    table.push([project, app.guid, app.title, app.type, moment(app.sysModified).fromNow()]);
  }, this);

  return table;
};

exports.createTableForProjects = function (projects) {
  var table = new Table({
    head: ['ID', 'Title', 'No. Apps', 'Last Modified'],
    style: exports.style()
  });

  _.each(projects, function (project) {
    var numApps = project.apps ? project.apps.length : 0;
    table.push([project.guid, project.title, numApps, moment(project.sysModified).fromNow()]);
  }, this);

  return table;
};

exports.createTableForProperties = function (type, opts, properties) {
  var table = new Table({
    head: ['guid', 'Name', 'Value'],
    style: exports.style()
  });
  _.each(properties, function (prop) {
    prop.guid = prop.guid || "none";
    var max = opts.max || 180;
    if (prop.value.length > max) {
      prop.value = "TRUNCATED TOO LONG TO DISPLAY. Try --json";
    }
    table.push([prop.guid, prop.name, prop.value]);
  }, this);
  return table;
};

exports.createTableForTeams = function (teams) {
  var table = new Table({
    head: ['id', 'Name'],
    style: exports.style()
  });
  _.each(teams, function (t) {
    table.push([t._id, t.name]);
  });
  return table;
};

exports.createTableForMbaasTargets = function (mbassTargets) {
  var table = new Table({
    head: ['ID', 'URL', 'Service Key', 'Username', 'Password', 'Modified', 'Size'],
    style: exports.style()
  });

  _.each(mbassTargets, function (mbaas) {
    table.push([mbaas._id, mbaas.url, mbaas.servicekey, mbaas.username, mbaas.password, moment(mbaas.modified).fromNow(), mbaas.size]);
  });

  return table;
};

exports.createTableForEnvironments = function (environments) {
  var table = new Table({
    head: ['ID', 'Label', 'Deploy on Create', 'Deploy on Update', 'mBaaS Targets', 'Modified'],
    style: exports.style()
  });

  _.each(environments, function (env) {
    var targets = [];
    _.each(env.targets, function (target) {
      targets.push(target._id);
    });

    // Display undefined options as 'false'
    var autoDeployOnCreate = env.autoDeployOnCreate;
    if(typeof autoDeployOnCreate === 'undefined') {
      autoDeployOnCreate = false;
    }
    var autoDeployOnUpdate = env.autoDeployOnUpdate;
    if(typeof autoDeployOnUpdate === 'undefined') {
      autoDeployOnUpdate = false;
    }

    table.push([env._id, env.label, autoDeployOnCreate, autoDeployOnUpdate, targets.join(", "), moment(env.modified).fromNow()]);
  });

  return table;
};

exports.createTableForCredentials = function (credentials) {
  var table = new Table({
    head: ['ID', 'Name', 'Platform', 'Type'],
    style: exports.style()
  });

  _.each(credentials, function (bundle) {
    table.push([bundle.id, bundle.bundleName, bundle.platform, bundle.bundleType]);
  }, this);

  return table;
};
//endregion

// put resources into table format..
exports.createTableForResources = function (resources) {
  var vals = [];

  // The resources api has changed since millicore 3.0.35
  // previously the Dyno resources were used, i.e. resources.usage above.
  // Now, an Apps usage is returned in resources.app.resources (and the
  // field names differ also.
  // So below is an attempt to keep backward compatability.

  if (resources.app && resources.app.resources) {
    // the new api for resources
    vals["Cpu (Max): "] = resources.app.resources.Cpu_Pct + "% (" + resources.resources.max.cpu + "%)";
    vals["Disk (Max): "] = kbytesToSize(resources.app.resources.Disk) + " (" + bytesToSize(resources.resources.max.disk) + ")";
    vals["Mem (Max): "] = kbytesToSize(resources.app.resources.VmRSS) + " (" + bytesToSize(resources.resources.max.mem) + ")";
  } else {
    showDynoResources(resources, vals);
  }

  return createObjectTable(vals);
};

// the old way - show the dyno resources
function showDynoResources(resources, vals) {
  for (var name in resources.usage) {
    if (resources.usage.hasOwnProperty(name)) {
      var head = name + " (Max)";
      if (name.toLowerCase() === "mem" || name.toLowerCase() === "disk") {
        vals[head] = bytesToSize(resources.usage[name]) + " (" + bytesToSize(resources.max[name]) + ")";
      } else if (name.toLowerCase() === "cpu") {
        vals[head] = resources.usage[name] + "% (" + resources.max[name] + "%)";
      } else {
        vals[head] = resources.usage[name] + " (" + resources.max[name] + ")";
      }
    }
  }
}

exports.createTableForNotifications = function (notifications) {
  var maxId = 24, maxUser = 25, maxTS = 20, maxType = 18, maxMessage = 25;
  for (var i = 0; i < notifications.length; i++) {
    var noti = notifications[i].fields;
    if (strlen(noti.eventType) > maxType) {
      maxType = strlen(noti.eventType);
    }
    if (strlen(noti.message) > maxMessage) {
      maxMessage = strlen(noti.message);
    }
    if (strlen(noti.updatedBy) > maxUser) {
      maxUser = strlen(noti.updatedBy);
    }
  }
  if (maxType > exports.maxTableCell) {
    maxType = exports.maxTableCell;
  }
  if (maxMessage > exports.maxTableCell) {
    maxMessage = exports.maxTableCell;
  }

  var table = new Table({
    head: ['Guid', 'When', 'Updated By', 'Event Name', 'Detail'],
    colWidths: [maxId + 2, maxTS + 2, maxUser + 2, maxType + 2, maxMessage + 2],
    style: exports.style()
  });

  _.each(notifications, function (notification) {
    var not = notification.fields;
    table.push([
      notification.guid,
      moment(not.sysCreated, 'YYYY-MM-DD h:mm:ss:SSS').fromNow(),
      not.updatedBy,
      not.eventType,
      not.message.replace(/[\r?\n]/g, " ")
    ]);
  });
  return table;
};

exports.createTableForAppEnvVars = function (appEnvVars, envValue) {
  var maxId = 24, maxTS = 20, maxName = 25, maxDevValue = 25, maxLiveValue = 25;
  for (var i = 0; i < appEnvVars.length; i++) {
    var appEnvVar = appEnvVars[i].fields;
    if (strlen(appEnvVar.name) > maxName) {
      maxName = strlen(appEnvVar.name);
    }
    if (strlen(appEnvVar.devValue) > maxDevValue) {
      maxDevValue = strlen(appEnvVar.devValue);
    }
    if (strlen(appEnvVar.liveValue) > maxLiveValue) {
      maxLiveValue = strlen(appEnvVar.liveValue);
    }
  }
  if (maxName > exports.maxTableCell) {
    maxName = exports.maxTableCell;
  }
  if (maxDevValue > exports.maxTableCell) {
    maxDevValue = exports.maxTableCell;
  }
  if (maxLiveValue > exports.maxTableCell) {
    maxLiveValue = exports.maxTableCell;
  }

  var tableHeaders = ['Guid', 'Modified', 'Name'];
  var tableColWidths = [maxId + 2, maxTS + 2, maxName + 2];
  if (!envValue) {
    tableHeaders.push("Dev Value");
    tableHeaders.push("Live Value");
    tableColWidths.push(maxDevValue + 2);
    tableColWidths.push(maxLiveValue + 2);
  } else if ("dev" === envValue) {
    tableHeaders.push("Dev Value");
    tableColWidths.push(maxDevValue + 2);
  } else {
    tableHeaders.push("Live Value");
    tableColWidths.push(maxLiveValue + 2);
  }
  var table = new Table({
    head: tableHeaders,
    colWidths: tableColWidths,
    style: exports.style()
  });

  for (var p = 0; p < appEnvVars.length; p++) {
    var appVar = appEnvVars[p].fields;
    var dataRow = [appVar.guid, moment(appVar.sysCreated, 'YYYY-MM-DD h:mm:ss:SSS').fromNow(), appVar.name];
    if (appVar.devValue) {
      dataRow.push(appVar.devValue);
    }
    if (appVar.liveValue) {
      dataRow.push(appVar.liveValue);
    }
    table.push(dataRow);
  }
  return table;
};

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return 'n/a';
  }
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i];
}

function kbytesToSize(kbytes) {
  var bytes = parseInt(kbytes) * 1024;
  return bytesToSize(bytes);
}

exports.createTableForTemplates = function (apps) {
  return exports.createTableForApps(apps);
};

function listApps(projectId, cb) {
  if (!cb) {
    cb = projectId;
    projectId = null;
  }

  if (projectId) {
    exports.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId, "Error reading app: ", function (err, data) {
      if (err) {
        return cb(err);
      }
      return cb(undefined, {list: data.apps, status: 'ok'});
    });
  } else {
    var payload = {};
    exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/list", payload, "Error reading app: ", cb);
  }
}

function listTemplates(cb) {
  var payload = {};
  exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/templatelist", payload, "Error reading template: ", cb);
}

function listProjects(cb) {
  exports.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/projects", "Error reading Projects: ", cb);
}

function listServices(cb) {
  exports.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/connectors", "Error reading Projects: ", cb);
}

// returns an array of App Ids
function formatIds(err, data, cb) {
  if (err) {
    return cb(err);
  }
  var ids = [];
  if (!err) {
    for (var i = 0; i < data.list.length; i++) {
      var app = data.list[i];
      ids.push(app.id);
    }
  }
  return cb(err, ids);
}

function getAppIds(cb) {
  listApps(function (err, data) {
    formatIds(err, data, cb);
  });
}

// curried type function for getProjectIds and getServiceIds
function getIds(listFunc) {
  return function (cb) {
    listFunc(function (err, collection) {
      if (err) {
        return cb(err);
      }
      var ids = _.pluck(collection, 'guid');
      return cb(null, ids);
    });
  };
}

// common read app
function readApp(projectId, appId, cb) {
  if (projectId) {
    exports.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId + "/apps/" + appId, "Error reading app: ", cb);
  } else {
    var payload = {
      payload: {
        guid: appId
      }
    };

    exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/read", payload, "Error reading app: ", cb);
  }
}

// Create a generic 'Name/Value' Table
function createNVTable(pairs) {
  var nvs = [];
  var maxName = 4, maxValue = 5;
  _.each(pairs, function (value, name) {
    if (strlen(name) > maxName) {
      maxName = strlen(name);
    }
    if (strlen(value) > maxValue) {
      maxValue = strlen(value);
    }
    nvs.push([name, util.inspect(value)]);
  });

  if (maxValue > exports.maxTableCell) {
    maxValue = exports.maxTableCell;
  }
  var table = new Table({
    head: ['Name', 'Value'],
    colWidths: [maxName + 2, maxValue + 2],
    style: exports.style()
  });

  for (var i = 0; i < nvs.length; i++) {
    table.push(nvs[i]);
  }

  return table;
}

function uppercaseRegexMatch(m, p1, p2) {
  return p1 + p2.toUpperCase();
}

// Create a generic Table from a single object. The object keys will be the table headers.
function createObjectTable(obj) {
  var heads = [], colWidths = [], vals = [];
  _.each(obj, function (v, k) {
    v = String(v);
    heads.push(k.replace(/(^|\s)([a-z])/g, uppercaseRegexMatch));
    vals.push(v);
    var width = Math.max(strlen(k), strlen(v)) + 2;
    if (width > exports.maxTableCell) {
      width = exports.maxTableCell;
    }
    colWidths.push(width);
  });

  var table = new Table({
    head: heads,
    colWidths: colWidths,
    style: exports.style()
  });

  table.push(vals);
  return table;
}

//Create a generic Table for a list of objects
//header object should define the key and max width
function createListTable(headers, list) {
  var heads = [], colWidths = [], cols = [];
  _.each(headers, function (v, k) {
    heads.push(k.replace(/(^|\s)([a-z])/g, uppercaseRegexMatch));
    cols.push(k);
    var width = Math.max(strlen(k), v) + 2;
    if (width > exports.maxTableCell) {
      width = exports.maxTableCell;
    }
    colWidths.push(width);
  });

  var table = new Table({
    head: heads,
    colWidths: colWidths,
    style: exports.style()
  });

  for (var i = 0; i < list.length; i++) {
    var obj = list[i];
    var out = [];
    for (var j = 0; j < cols.length; j++) {
      var col_name = cols[j];
      out.push(obj[col_name]);
    }
    table.push(out);
  }
  return table;
}

// table format for a single app.. we convert into a generic N/V pair table of app properties
function createTableForAppProps(app) {

  // check if its an ngui app
  if (!app.legacy) {
    return createNVTable(app);
  }
  // otherwise its an old style app
  var pairs = {
    Id: app.inst.guid,
    Title: app.inst.title,
    Description: app.inst.description,
    W3C: app.app.w3cid,
    Widg: app.app.guid,
    Config: JSON.stringify(app.inst.config)
  };
  var runtime;
  if (app.inst.config && app.inst.config.nodejs && app.inst.config.nodejs.app) {
    runtime = app.inst.config.nodejs.app.runtime;
  }
  var target = ini.get('live') ? 'live' : 'dev';
  if (runtime) {
    pairs.Runtime = runtime[target] || "";
  }
  var scm = app.app.config.scm;
  if (scm) {
    if (scm.url) {
      pairs["Git Url"] = scm.url;
    }
    if (scm.branch) {
      pairs["Git Branch"] = scm.branch;
    }
    if (scm.key) {
      pairs.Key = scm.key;
    }
  }

  return createNVTable(pairs);
}

function createRuntimeTable(data) {
  var pairs;
  if (data && data.result) {
    pairs = {};
    for (var i = 0; i < data.result.length; i++) {
      var rtime = data.result[i];
      if (rtime.default) {
        pairs[rtime.name + " *"] = rtime.version;
      }
      else {
        pairs[rtime.name] = rtime.version;
      }
    }
  }

  if (pairs) {
    return createNVTable(pairs);
  }
}

// Env Var functions
function postEnv(action, payload, errorMsg, cb) {
  exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/app/envvariable/" + action, payload, errorMsg, cb);
}

exports.createAppEnv = function (appId, varName, value, env, cb) {
  var params = {appId: appId, name: varName};
  if (env === 'live') {
    params.liveValue = value;
  } else if (env === 'dev') {
    params.devValue = value;
  }
  postEnv("create", params, "Error creating env var: ", cb);
};

exports.readAppEnv = function (appId, envVarId, envValue, cb) {
  postEnv("read", {appId: appId, envVarId: envVarId, env: envValue}, "Error reading env var: ", cb);
};

exports.updateAppEnv = function (appId, envVarId, varName, value, env, cb) {
  var params = {appId: appId, envVarId: envVarId, name: varName};
  if (env === 'dev') {
    params.devValue = value;
  } else if (env === 'live') {
    params.liveValue = value;
  }
  postEnv("update", params, "Error updating env var: ", cb);
};

exports.deleteAppEnv = function (appId, envVarId, envValue, cb) {
  postEnv("delete", {appId: appId, envVarId: envVarId, env: envValue}, "Error deleting env var: ", cb);
};

exports.listAppEnv = function (appId, env, cb) {
  postEnv("list", {appId: appId, env: env}, "Error listing env var: ", cb);
};

exports.unsetAppEnv = function (params, cb) {
  postEnv("unset", params, "Error unseting env var:", cb);
};

exports.pushAppEnv = function (appId, env, cb) {
  postEnv("push", {appId: appId, env: env}, "Error pushing env vars:", cb);
};

exports.listDeployedAppEnv = function (appId, env, cb) {
  postEnv("listDeployed", {appId: appId, env: env}, "Error listing deployed env vars:", cb);
};

//parse <key>=<value> format
function parseArgs(args) {
  var opts = {};
  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (arg.indexOf('=') === -1) throw new Error('Invalid argument format: ' + arg);
    var kv = arg.split("=");
    log.silly(kv, 'build arg');
    opts[kv[0]] = (kv[1] === undefined ? "" : kv[1]);
  }

  return opts;
}

// Annoyingly, 'request' returns nulls, the rest of FHC uses undefined, so return undefined to keep
// things consistent.
exports.nullToUndefined = function (err) {
  return err === null ? undefined : err;
};

// utility function for calculating the max width of a field in a collection of objects. Used for table building.
function maxField(collection, field, header) {
  var fields = _.pluck(collection, field);
  var sizes = _.map(fields, function (f) {
    return strlen(f);
  });
  sizes.push(strlen(field));
  sizes.push(strlen(header));
  return _.max(sizes);
}

// generic create table function, should be used for new tables instead of the legacy ways above..
function createTableFromArray(headers, fields, values) {
  var colWidths = _.map(fields, function (f, index) {
    return maxField(values, f, headers[index]) + 2;
  });

  var table = new Table({
    head: headers,
    colWidths: colWidths,
    style: exports.style()
  });

  _.each(values, function (t) {
    var vals = _.map(fields, function (f) {
      return t[f] ? t[f] : '';
    });
    table.push(vals);
  });
  return table;
}

// string utility function
function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

exports.createNVTable = createNVTable;
exports.createObjectTable = createObjectTable;
exports.createTableForAppProps = createTableForAppProps;
exports.createListTable = createListTable;
exports.listApps = listApps;
exports.listProjects = listProjects;
exports.listServices = listServices;
exports.listTemplates = listTemplates;
exports.readApp = readApp;
exports.getAppIds = getAppIds;
exports.getProjectIds = getIds(listProjects);
exports.getServiceIds = getIds(listServices);
exports.strlen = strlen;
exports.maxTableCell = 100;
exports.parseArgs = parseArgs;
exports.createRuntimeTable = createRuntimeTable;
exports.maxField = maxField;
exports.createTableFromArray = createTableFromArray;
exports.endsWith = endsWith;
