/* globals i18n */
var log = require("../../../utils/log");
var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");
var common = require("../../../common");
var ini = require('../../../utils/ini');

// update app properties
// if the property name is one of our known app property names (e.g. title, description, etc) then
// we update it specifically. If its not, we add the name/value to the config object.
// Note that git properties are updated through the git command.
var doUpdate = function(projectId, appId, name, value, cb) {
  name = name.toLowerCase();
  if (!projectId) {
    var knownProps = ['title', 'description', 'width', 'height'];
    if (knownProps.indexOf(name) !== -1) {
      setKnownProperty(appId, name, value, cb);
    } else {
      setConfigProperty(appId, name, value, cb);
    }
  } else {
    // property updates done very differently in ngui
    updateNguiProperty(projectId, appId, name, value, cb);
  }
};

var update = function update(argv, cb) {
  var args = argv._;
  if (args.length === 0 || args.length > 4) {
    return cb(update.usage);
  }

  var projectId;
  var appId = fhc.appId(args[0]);
  var name = args[1];
  var value = args[2];

  if (args.length === 4) {
    projectId = args[0];
    appId = fhc.appId(args[1]);
    name = args[2];
    value = args[3];
  }
  return doUpdate(projectId, appId, name, value, cb);
};

module.exports = update;
update.update = update;
update.doUpdate = doUpdate;
update.usage = "fhc app update [project-id] <app-id> <property-name> <property-value>";


// set a config object property
function setConfigProperty(appId, k, v, cb) {
  fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/setconfig", {
    guid: appId,
    key: k,
    value: v
  }, function(er, remoteData) {
    if (er) {
      log.error(i18n._("Error reading app: ") + er);
      cb(er);
    } else {
      if (remoteData.status !== 'ok') {
        return cb(remoteData.messsage, remoteData);
      }
      update.message = i18n._("Config property set ok");
      return cb(undefined, remoteData);
    }
  });
}

// Set one of our known properties..
// Note: although we're just setting properties on the app object, the app update endpoint expects the full config object..
function setKnownProperty(appId, k, v, cb) {
  common.readApp(appId, function(err, cfg) {
    if (err) {
      return cb(err);
    }

    // the config object returned from readApp is not the expected format for app/update :-(
    var payload = {
      "payload": {
        "app": cfg.app.guid,
        "inst": appId,
        "title": cfg.inst.title,
        "description": cfg.inst.description,
        "height": cfg.inst.height,
        "width": cfg.inst.width,
        "config": cfg.inst.config,
        "widgetConfig": cfg.app.config
      },
      "context": {}
    };

    // update the respective nv pair
    payload.payload[k] = v;

    fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/update", payload, function (err, remoteData) {
      if (err) {
        log.error(i18n._("Error updating app: ") + err);
        cb(err);
      } else {
        update.message = i18n._("Property set ok");
        if (remoteData.status !== 'ok') {
          update.message = i18n._("Error setting property: ") + remoteData.message;
          return cb(remoteData.messsage, remoteData);
        }
        return cb(undefined, remoteData);
      }
    });
  });
}

// ngui property update - read the project, then update the properties
function updateNguiProperty(projectId, appId, name, value, cb) {
  common.readApp(projectId, appId, function(err, app) {
    if (err) {
      return cb(err);
    }
    app[name] = value;
    fhreq.PUT(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId + "/apps/" + appId, app, function(err, remoteData, raw, response) {
      if (err) {
        return cb(err);
      }
      if (response.statusCode !== 200) {
        return cb(raw);
      }

      if (ini.get('table') === true && remoteData) {
        update.table = common.createTableForAppProps(remoteData);
      }
      return cb(undefined, remoteData);
    });
  });
}

// bash completion
update.completion = function(opts, cb) {
  common.getAppIds(cb);
};
