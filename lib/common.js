// Misc common functions..
/* globals i18n */
var util = require('util');
var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var Table = require('cli-table');
var ini = require('./utils/ini');
var moment = require("moment");
var _ = require("underscore");

// TODO split into smaller modules with specific role.

// Common API call to FeedHenry
exports.doApiCall = function(host, uri, payload, errorMsg, cb) {
  fhreq.POST(host, uri, payload, function(err, remoteData, raw) {
    if (err) {
      return cb(err);
    }
    if (!remoteData) {
      return cb(i18n._("No remoteData returned. Raw response is: ") + util.inspect(raw));
    }
    if (remoteData.msg !== undefined && remoteData.address !== undefined) {
      if (remoteData.address["login-status"] === 'none') {
        return cb(i18n._("Error, check your login details.. \n") + remoteData.msg);
      }
    }

    if (remoteData.status !== undefined && remoteData.status !== 'ok') {
      var msg = remoteData.message || remoteData.msg || util.inspect(remoteData);
      return cb(errorMsg + msg, remoteData);
    }
    return cb(undefined, remoteData);
  });
};

exports.doPutApiCall = function(host, uri, payload, cb) {
  fhreq.PUT(host, uri, payload, function(err, remoteData, raw, response) {
    if (err) {
      return cb(err);
    }
    if (!remoteData) {
      return cb(i18n._("No remoteData returned. Raw response is: ") + util.inspect(raw));
    }
    if (remoteData.msg !== undefined && remoteData.address !== undefined) {
      if (remoteData.address["login-status"] === 'none') {
        return cb(i18n._("Error, check your login details.. \n") + remoteData.msg);
      }
    }

    if (response.statusCode !== 200) {
      return cb(raw);
    }

    if (remoteData.status !== undefined && remoteData.status !== 'ok') {
      var msg = remoteData.message || remoteData.msg;
      return cb(msg, remoteData);
    }
    return cb(undefined, remoteData);
  });
};

exports.doGetApiCall = function(host, uri, errorMsg, cb) {
  fhreq.GET(host, uri, function(err, remoteData, raw, response) {
    if (err) {
      return cb(err);
    }
    if (!remoteData) {
      return cb(i18n._("No remoteData returned. Raw response is: ") + util.inspect(raw));
    }
    if (remoteData.msg !== undefined && remoteData.address !== undefined) {
      if (remoteData.address["login-status"] === 'none') {
        return cb(i18n._("Error, check your login details.. \n") + remoteData.msg);
      }
    }

    if (response.statusCode !== 200) {
      return cb(raw);
    }
    if (remoteData.status !== undefined && remoteData.status !== 'ok') {
      var msg = remoteData.message || remoteData.msg;
      return cb(errorMsg + msg, remoteData);
    }
    return cb(undefined, remoteData, response.status);
  });
};

exports.doDeleteApiCall = function(host, uri, payload, errorMsg, cb) {
  fhreq.DELETE(host, uri, payload, function(err, remoteData, raw) {
    if (err) {
      return cb(err);
    }
    if (!remoteData) {
      return cb(i18n._("No remoteData returned. Raw response is: ") + util.inspect(raw));
    }
    if (remoteData.msg !== undefined && remoteData.address !== undefined) {
      if (remoteData.address["login-status"] === 'none') {
        return cb(i18n._("Error, check your login details.. \n") + remoteData.msg);
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

exports.getAppContainer = function(appId, cb) {
  var uri = 'box/srv/1.1/wid/' + fhc.curTarget + '/studio/' + appId + '/container';

  fhreq.GET(fhreq.getFeedHenryUrl(), uri, function(err, remoteData, raw, response) {
    if (err) {
      return cb(err);
    }
    if (response.statusCode === 404) {
      return cb(i18n._('"Error, check app is deployed and guid is correct...'), null);
    }
    return cb(undefined, raw);
  });
};

// Poll remote job until its finished
exports.waitForJob = function(cacheKey, start, cb) {
  var wantJson = ini.get('json');
  setTimeout(function() {
    log.silly(util.format(i18n._("polling for cacheKey: %s start: %s to complete"), cacheKey, start), "Polling");
    var cc = {};
    cc.cacheKey = cacheKey;
    cc.start = start;
    var params = [cc];

    var uri = 'box/srv/1.1/dat/log/read?cacheKeys=' + JSON.stringify(params);
    uri = uri.replace(/"/g, '%22');
    fhreq.GET(fhreq.getFeedHenryUrl(), uri, function(err, remoteData) {

      if (err) {
        return cb(err);
      }
      if (remoteData[0] && remoteData[0].status !== undefined && remoteData[0].status === 'pending') {
        log.silly(remoteData[0].log, "waitforjob");
        start++;
        if (!wantJson) {
          if (remoteData[0].progress) {
            console.log(i18n._("Progress: ") + remoteData[0].progress + "%");
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
exports.getAppNameUrl = function(appId, env, cb) {
  exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/hosts", {payload: {guid: appId}}, "", function(err, data) {
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
exports.waitFor = function(key, cb) {
  exports.waitForJob(key, 0, cb);
};

//region Tables

// common style for all our tables
exports.style = function() {
  var color = ini.get('thcolor') || 'green';
  var ret = {
    'padding-left': 1,
    'padding-right': 1,
    head: [color]
  };
  return ret;
};

/**
 * Creating a table to view log results (See https://www.elastic.co/guide/en/elasticsearch/reference/1.5/_the_search_api.html)
 * @param logSearchResults
 */
exports.createTableForSyslogs = function(logSearchResults) {
  var table = new Table({
    head: ['Time', 'Message', 'Level'],
    style: exports.style()
  });

  _.each((logSearchResults.hits || {}).hits || [], function(logEntry) {
    var messages = _.pick(logEntry._source, 'msg', 'error', 'err', 'message');

    messages = _.map(_.compact(messages), function(message) {
      return message.replace(/\r?\n|\r/g,'');
    });

    table.push([logEntry._source.time, messages.join(' '), logEntry._source.level]);
  }, this);

  return table;
};

// put our apps into table format..
exports.createTableForApps = function(apps) {
  // calculate widths
  var maxId = 4, maxTitle = 5, maxDescription = 11, maxAlias = 5;

  _.each(apps, function(app) {
    if (!app.id) {
      app.id = app.guid;
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

  _.each(apps, function(ap) {
    table.push([ap.id, ap.title, ap.description, ap.alias]);
  });
  return table;
};

exports.createTableForSubmissions = function(submissionsResult) {
  var table = new Table({
    head: ['ID', 'Form ID', 'Form Name', 'Project GUID', 'Project Name', 'Submitted At'],
    style: exports.style()
  });

  var submissions = submissionsResult.submissions || [];

  _.each(submissions, function(submission) {
    table.push([submission._id, submission.formId, submission.formName, submission.appId, submission.appName, moment(submission.submissionCompletedTimestamp).format('MMMM Do YYYY, h:mm:ss a')]);
  }, this);

  return table;
};

/**
 * A Table For Listing Data Sources
 * @param dataSources
 */
exports.createTableForDataSources = function(dataSources, service) {
  var table = new Table({
    head: ['ID', 'Name', 'Service ID', 'Service Title', 'Endpoint', 'Refresh Interval', 'Number Of Audit Logs'],
    style: exports.style()
  });

  dataSources = _.isArray(dataSources) ? dataSources : [dataSources];

  _.each(dataSources, function(dataSource) {
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
exports.createTableForEnvDataSourcesAuditLogs = function(dataSource, options) {
  var table = new Table({
    head: ['Service ID', 'Service Name', 'Endpoint', 'Status', 'Error', 'Data Length', 'Data Hash', 'Refresh Timestamp'],
    style: exports.style()
  });

  var auditLogs = dataSource.auditLogs || [];

  _.each(_.first(auditLogs, options.limit || auditLogs.length), function(dsAuditLogEntry) {
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
exports.createTableForEnvDataSources = function(dataSources) {
  var table = new Table({
    head: ['ID', 'Name', 'Service ID', 'Service Name', 'Endpoint', 'Status', 'Error', 'Data Length', 'Last Refreshed'],
    style: exports.style()
  });

  dataSources = _.isArray(dataSources) ? dataSources : [dataSources];

  _.each(dataSources, function(dataSource) {

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
exports.createTableForEnvDataSourcesValidation = function(dataSources) {
  var table = new Table({
    head: ['Name', 'Service ID', 'Service Name', 'Endpoint', 'Valid', 'Message', 'Data Length'],
    style: exports.style()
  });

  dataSources = _.isArray(dataSources) ? dataSources : [dataSources];

  _.each(dataSources, function(dataSource) {

    var validationResult = dataSource.validationResult;
    var dataLength = dataSource.data ? dataSource.data.length : 0;

    table.push([dataSource.name, dataSource.service.guid, dataSource.service.title, dataSource.endpoint, validationResult.valid, validationResult.message, dataLength]);
  }, this);

  return table;
};

exports.createTableForProjectApps = function(project, apps) {
  var table = new Table({
    head: ['Project ID', 'ID', 'Title', 'Type', 'Last Modified'],
    style: exports.style()
  });

  _.each(apps, function(app) {
    table.push([project, app.guid, app.title, app.type, moment(app.sysModified).fromNow()]);
  }, this);

  return table;
};

exports.createTableForProjects = function(projects) {
  var table = new Table({
    head: ['ID', 'Title', 'No. Apps', 'Last Modified'],
    style: exports.style()
  });

  _.each(projects, function(project) {
    var numApps = project.apps ? project.apps.length : 0;
    table.push([project.guid, project.title, numApps, moment(project.sysModified).fromNow()]);
  }, this);

  return table;
};

exports.createTableForTemplates = function(templates, type) {
  var table;
  switch (type) {
  case 'projects':
    table = new Table({
      head: ['Id', 'Name', 'Type', 'Category'],
      style: exports.style()
    });
    _.each(templates, function(t) {
      table.push([t.id, t.name, t.type, t.category]);
    }, this);
    return table;
  case 'services':
    table = new Table({
      head: ['Id', 'Name', 'Category'],
      style: exports.style()
    });
    _.each(templates, function(t) {
      table.push([t.id, t.name, t.category]);
    }, this);
    return table;
  case 'apps':
    table = new Table({
      head: ['Id', 'Name', 'Type', 'Category', 'Repo'],
      style: exports.style()
    });
    _.each(templates, function(t) {
      table.push([t.id, t.name, t.type,t.category, t.repoUrl]);
    }, this);
    return table;
  default:
    return table;
  }
};

exports.createTableForProperties = function(type, opts, properties) {
  var table = new Table({
    head: ['guid', 'Name', 'Value'],
    style: exports.style()
  });
  _.each(properties, function(prop) {
    prop.guid = prop.guid || "none";
    var max = opts.max || 180;
    if (prop.value.length > max) {
      prop.value = "TRUNCATED TOO LONG TO DISPLAY. Try --json";
    }
    table.push([prop.guid, prop.name, prop.value]);
  }, this);
  return table;
};

exports.createTableForTeams = function(teams) {
  var table = new Table({
    head: ['id', 'Name'],
    style: exports.style()
  });
  _.each(teams, function(t) {
    table.push([t._id, t.name]);
  });
  return table;
};

exports.createTableForMbaasTargets = function(mbassTargets) {
  var table = new Table({
    head: ['ID', 'Label', 'URL', 'Service Key', 'Username', 'Password', 'Modified', 'Size'],
    style: exports.style()
  });

  _.each(mbassTargets, function(mbaas) {
    table.push([mbaas.id, mbaas.label, mbaas.url, mbaas.servicekey, mbaas.username, mbaas.password, moment(mbaas.modified).fromNow(), mbaas.size]);
  });

  return table;
};

exports.createTableForEnvironments = function(environments) {
  var table = new Table({
    head: ['ID', 'Label', 'Deploy on Create', 'Deploy on Update', 'MBaaS Targets', 'Modified'],
    style: exports.style()
  });

  _.each(environments, function(env) {
    var targetId = 'none';
    if (env.target) {
      targetId = env.target.id;
    }

    // Display undefined options as 'false'
    var autoDeployOnCreate = env.autoDeployOnCreate;
    if (typeof autoDeployOnCreate === 'undefined') {
      autoDeployOnCreate = false;
    }
    var autoDeployOnUpdate = env.autoDeployOnUpdate;
    if (typeof autoDeployOnUpdate === 'undefined') {
      autoDeployOnUpdate = false;
    }

    table.push([env.id, env.label, autoDeployOnCreate, autoDeployOnUpdate, targetId, moment(env.modified).fromNow()]);
  });

  return table;
};

exports.createTableForStatus = function(result) {
  var table = new Table({
    head: ['Status', result.status],
    style: exports.style()
  });
  table.push(['ampq', result.summary.amqp]);
  table.push(['db', result.summary.db]);
  table.push(['cache', result.summary.cache]);
  table.push(['git', result.summary.git]);

  return table;
};

exports.createTableForRuntimes = function(runtimes) {
  var table = new Table({
    head: ['Name', 'Description', 'Version', 'Npm Version'],
    style: exports.style()
  });

  _.each(runtimes, function(runtime) {
    var npmVersion = " - ";
    if (runtime.npm && runtime.npm.version) {
      npmVersion = runtime.npm.version;
    }
    table.push([runtime.name, runtime.description, runtime.version, npmVersion]);
  });

  return table;
};


exports.createTableForCredentials = function(credentials) {
  var table = new Table({
    head: ['ID', 'Name', 'Platform', 'Type'],
    style: exports.style()
  });

  _.each(credentials, function(bundle) {
    table.push([bundle.id, bundle.bundleName, bundle.platform, bundle.bundleType]);
  }, this);

  return table;
};
//endregion

// put resources into table format..
exports.createTableForResources = function(resources) {
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

exports.createTableForNotifications = function(notifications) {
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

  _.each(notifications, function(notification) {
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

exports.createTableForAppEnvVars = function(appEnvVars, envValue) {
  var table = new Table({
    head: ['ID', 'Modified', 'Name', 'Value'],
    style: exports.style()
  });
  if (appEnvVars.length > 0) {
    _.each(appEnvVars, function(env) {
      var modified =  moment(env.sysCreated).fromNow();
      var value = "";
      if (env.varValues &&  env.varValues[envValue]) {
        value = env.varValues[envValue];
        if ( env.masked ) {
          value = "*";
        }
      }
      table.push([env.guid || "n/a", modified, env.varName, value]);
    });
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

function listApps(projectId, cb) {
  if (!cb) {
    cb = projectId;
    projectId = null;
  }

  if (projectId) {
    exports.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId, i18n._("Error reading app: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      return cb(undefined, {list: data.apps, status: 'ok'});
    });
  } else {
    var payload = {};
    exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/list", payload, i18n._("Error reading app: "), cb);
  }
}

function listTemplates(cb) {
  var payload = {};
  exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/templatelist", payload, i18n._("Error reading template: "), cb);
}

function listProjects(cb) {
  exports.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/projects", i18n._("Error reading Projects: "), cb);
}

function createService(payload,cb) {
  exports.doApiCall(fhreq.getFeedHenryUrl(), "box/api/connectors", payload, i18n._("Error creating service: "), cb);
}

function createProject(payload,cb) {
  exports.doApiCall(fhreq.getFeedHenryUrl(), "box/api/projects", payload, i18n._("Error creating project: "), cb);
}

function listServices(cb) {
  exports.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/connectors", i18n._("Error reading Projects: "), cb);
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
  listApps(function(err, data) {
    formatIds(err, data, cb);
  });
}

// curried type function for getProjectIds and getServiceIds
function getIds(listFunc) {
  return function(cb) {
    listFunc(function(err, collection) {
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
    exports.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId + "/apps/" + appId, i18n._("Error reading app: "), cb);
  } else {
    var payload = {
      payload: {
        guid: appId
      }
    };

    exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/read", payload, i18n._("Error reading app: "), cb);
  }
}

function deleteApp(projectId, appId, cb) {
  if (projectId) {
    fhreq.DELETE(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId + '/apps/' + appId, function(err, remoteData, raw, response) {
      if (err) {
        return cb(err);
      }
      if (response.statusCode !== 200) {
        return cb(raw);
      }
      return cb(null, remoteData);
    });
  } else {
    var payload = {
      payload: {
        confirmed: "true",
        guid: appId
      },
      context: {}
    };

    this.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/delete", payload, i18n._("Error deleting app: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      return cb(err, data);
    });
  }
}


function readAppWithoutProject(appId, cb) {
  readApp(null, appId, cb);
}

// Create a generic 'Name/Value' Table
function createNVTable(pairs) {
  var nvs = [];
  var maxName = 4, maxValue = 5;
  _.each(pairs, function(value, name) {
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
  _.each(obj, function(v, k) {
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
  _.each(headers, function(v, k) {
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
      } else {
        pairs[rtime.name] = rtime.version;
      }
    }
  }

  if (pairs) {
    return createNVTable(pairs);
  }
}

/**
 * Creating A Table For Displaying MBaaS export jobs
 * @param appDataList
 */
exports.createTableForDevices = function(devices) {
  var table = new Table({
    head: ["CUID","Name","Blacklisted", "Disabled", "Type", "Created", "Modified"],
    style: exports.style()
  });

  var list = devices || [];

  _.each(list, function(dev) {
    table.push([dev.fields.cuid, dev.fields.name, dev.fields.blacklisted, dev.fields.disabled, dev.type, moment(dev.fields.sysCreated).fromNow(), moment(dev.fields.sysModified).fromNow()]);
  });

  return table;
};


/**
 * Creating A Table For Displaying MBaaS export jobs
 * @param appDataList
 */
exports.createTableForAppData = function(appDataList) {
  var table = new Table({
    head: ['Job ID', 'App ID', 'Environment', 'Status'],
    style: exports.style()
  });

  var list = appDataList || [];

  _.each(list, function(data) {
    var jobId = data._id;
    var appId = data.appid;
    var env = data.environment;
    var status = data.status;

    table.push([jobId, appId, env, status]);
  });

  return table;
};

//parse <key>=<value> format
function parseArgs(args) {
  var opts = {};
  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (arg.indexOf('=') === -1) {
      throw new Error(i18n._('Invalid argument format: ') + arg);
    }
    var kv = arg.split("=");
    log.silly(kv, 'build arg');
    opts[kv[0]] = (kv[1] === undefined ? "" : kv[1]);
  }

  return opts;
}

// Annoyingly, 'request' returns nulls, the rest of FHC uses undefined, so return undefined to keep
// things consistent.
exports.nullToUndefined = function(err) {
  return err === null ? undefined : err;
};

// utility function for calculating the max width of a field in a collection of objects. Used for table building.
function maxField(collection, field, header) {
  var fields = _.pluck(collection, field);
  var sizes = _.map(fields, function(f) {
    return strlen(f);
  });
  sizes.push(strlen(field));
  sizes.push(strlen(header));
  return _.max(sizes);
}

// generic create table function, should be used for new tables instead of the legacy ways above..
function createTableFromArray(headers, fields, values) {
  var colWidths = _.map(fields, function(f, index) {
    return maxField(values, f, headers[index]) + 2;
  });

  var table = new Table({
    head: headers,
    colWidths: colWidths,
    style: exports.style()
  });

  _.each(values, function(t) {
    var vals = _.map(fields, function(f) {
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

function createTableForEventAlert(values) {
  var headers = ['ID', 'Name', 'Emails', 'Enabled', 'Categories', 'Names', 'Severities'];
  var fields = ['guid','alertName', 'emails', 'enabled', 'eventCategories', 'eventNames', 'eventSeverities'];
  return createTableFromArray(headers, fields, values);
}

exports.createNVTable = createNVTable;
exports.createObjectTable = createObjectTable;
exports.createTableForAppProps = createTableForAppProps;
exports.createListTable = createListTable;
exports.listApps = listApps;
exports.listProjects = listProjects;
exports.createService = createService;
exports.createProject = createProject;
exports.listServices = listServices;
exports.listTemplates = listTemplates;
exports.readApp = readApp;
exports.deleteApp = deleteApp;
exports.readAppWithoutProject = readAppWithoutProject;
exports.getAppIds = getAppIds;
exports.getProjectIds = getIds(listProjects);
exports.getServiceIds = getIds(listServices);
exports.strlen = strlen;
exports.maxTableCell = 100;
exports.parseArgs = parseArgs;
exports.createRuntimeTable = createRuntimeTable;
exports.maxField = maxField;
exports.createTableFromArray = createTableFromArray;
exports.createTableForEventAlert = createTableForEventAlert;
exports.endsWith = endsWith;
