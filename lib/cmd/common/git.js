/* globals i18n */
module.exports = git;

git.desc = i18n._("Git operations on a FeedHenry App which doesn't have it's own repo"); // TODO Is this still valid in FH3?
git.usage = "\nfhc git [props] <app-id>" + "\nfhc git set <app-id> <git-prop-name> <git-prop-value>" + "\nfhc git pull <app-id> [--clean]";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var millicore = require("../../utils/millicore.js");
var ini = require('../../utils/ini');
var Table = require('cli-table');
var util = require('util');

// Main git command entry point
function git(argv, cb) {
  var args = argv._;

  if (args.length === 0 || args.length > 4) {
    return cb(git.usage);
  }

  var action = args[0],
    appId;
  if (action === 'props') {
    appId = fhc.appId(args[1]);
    return props(appId, cb);
  } else if (action === 'pull' && !argv.clean) {
    appId = fhc.appId(args[1]);
    return pull(appId, cb);
  } else if (action === 'pull' && argv.clean) {
    appId = fhc.appId(args[1]);
    return cleanClone(appId, cb);
  } else if (action === 'set') {
    args.shift();
    if (args.length === 0 || args.length > 3) {
      return cb(git.usage);
    }
    appId = fhc.appId(args[0]);
    var name = args[1];
    var value = args[2];
    return set(appId, name, value, cb);
  } else {
    return cb(git.usage);
  }
}

// git props
function props(appId, cb) {
  getGitProps(appId, function(err, scm) {
    if (err) return cb(err);
    if (!scm) git.message = util.format(i18n._("'%s' is not a Git based Application"), appId);
    if (scm && ini.get('table') === true && scm) {
      createTableForProps(scm);
    }
    if (!scm) scm = {};
    return cb(err, scm);
  });
}

// Git set properties
// Note: although we're just setting scm related properties, the app update endpoint expects the full config object..
function set(appId, k, v, cb) {
  common.readAppWithoutProject(appId, function(err, cfg) {
    if (err) return cb(err);

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
        "widgetConfig": cfg.inst.config
      },
      "context": {}
    };

    // update the payload scm parameters
    var scm;
    if (cfg.inst && cfg.inst.config && cfg.inst.config.scm) {
      scm = cfg.inst.config.scm;
    }
    if (!scm) {
      git.message = util.format(i18n._("'%s' is not a Git based Application"), appId);
    }
    payload.payload.widgetConfig.scm[k] = v;

    fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/update", payload, function(err, remoteData) {
      if (err) {
        log.error(i18n._("Error updating app: ") + err);
        cb(err);
      } else {
        git.message = "Property set ok";
        if (remoteData.status !== 'ok') {
          git.message = i18n._("Error setting property: ") + remoteData.message;
          return cb(remoteData.messsage, remoteData);
        }
        return cb(undefined, remoteData);
      }
    });
  });
}

function cleanClone(appId, cb) {
  var payload = {
    clean: true
  };

  if (!appId) {
    return cb(
      new Error(i18n._('appId is required to perform a clean clone'))
    );
  }

  millicore.widgForAppId(appId, function(err, widgId) {
    if (err) {
      return cb(err);
    }
    //Sample URL: https://domain.feedhenry.com/box/api/connectors/{widget}/apps/{appId}/pull
    fhreq.POST(fhreq.getFeedHenryUrl(), '/box/api/projects/' + widgId + '/apps/' + appId + '/pull', payload, function(err, data) {
      if (err) {
        return cb(err);
      } else if (!data.cacheKeys) {
        return cb(i18n._('Error in clean clone, unexpected response format'));
      } else {
        // Now we need to do the actual pull
        pull(appId, cb);
      }
    });
  });
}

// tell FeedHenry to do a 'git pull'
function pull(appId, cb) {
  var payload = {
    payload: {
      guid: appId
    }
  };
  millicore.widgForAppId(appId, function(err, widgId) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/pub/app/" + widgId + "/refresh", payload, i18n._("Error in Git pull: "), function(err, data) {
      if (err) return cb(err);
      if (data.status !== 'ok') return cb(i18n._("Error in Git pull: ") + data.error);
      if (data.cacheKey) {
        return common.waitFor(data.cacheKey, function(err, data) {
          if (err)
            return cb(err);
          if (data[0] && data[0].log && data[0].log[0])
            git.message = data[0].log.join(' ');
          return cb(err, data);
        });
      }
      return cb(err, data);
    });
  });
}

// table format for Git Properties
function createTableForProps(scm) {
  var url = scm.url;
  var branch = scm.branch;

  var branchLen = common.strlen(branch) < 6 ? 8 : common.strlen(branch);

  // create our table
  git.table = new Table({
    head: ['Url', 'Branch'],
    colWidths: [common.strlen(url) + 2, branchLen + 2],
    style: common.style()
  });

  git.table.push([url, branch]);
}

// get git properties
function getGitProps(appId, cb) {
  // TODO check for valid app guid/app exists
  var payload = {
    payload: {
      guid: appId
    }
  };
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/read", payload, i18n._("Error reading Git properties: "), function(err, data) {
    if (err) return cb(err);
    if (data.status !== 'ok') return cb(i18n._("Error reading Git properties: ") + (data.error || data.msg));
    var scm;
    if (data.app && data.inst.config && data.inst.config.scm) scm = data.inst.config.scm;
    return cb(err, scm);
  });
}

// bash completion
git.completion = function(opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "git") argv.unshift("git");
  if (argv.length === 2) {
    return cb(null, ["props", "set", "pull"]);
  }

  if (argv.length === 3) {
    var action = argv[2];
    switch (action) {
      case "props":
      case "set":
      case "pull":
        common.getAppIds(cb);
        break;
      default:
        return cb(null, []);
    }
  }
};