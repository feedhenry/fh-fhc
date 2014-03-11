module.exports = projects;

projects.usage = "fhc projects [list]"
    + "\nfhc projects create <project-id> [<type>]"
    + "\nfhc projects update <project-id> <prop-name> <value>"
    + "\nfhc projects read <project-id>"
    + "\nfhc projects delete <project-id>"
    + "\nwhere <project-id> is a project id"
    + "\nwhere <type> is a valid project type [default]";

var log = require("./utils/log");
var common = require("./common");
var fhreq = require("./utils/request");
var fhc = require("./fhc");
var ini = require('./utils/ini');

var API_URL = "box/api/projects";

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + projects.usage);
};

function projects(args, cb) {
  if (args.length === 0) return listProjects(args, cb);

  var action = args[0];
  if ("list" === action) {
    return listProjects(args, cb);
  } else if ("create" === action) {
    return createProject(args, cb);
  } else if ("update" === action) {
    return updateProject(args, cb);
  } else if ("delete" === action) {
    return deleteProject(args, cb);
  } else if ("read" === action) {
    if (args.length !== 2) return cb(projects.usage);
    return readProject(args[1], cb);
  } else {
    return unknown("Invalid project action " + action, cb);
  }
};

function listProjects(args, cb) {
  common.listProjects(function (err, projects) {
    if (err) return cb(err);
    if (ini.get('table') === true) {
      projects.table = common.createTableForProjects(projects);
    }
    return cb(err, projects);
  });
}

function createProject(args, cb) {
  if (args.length < 2) {
    return unknown("Invalid arguments", cb);
  }

  var title = args[1];
  var type = args[2] || "default";
  var params =  {
    title: title,
    template: {"type" : type}
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), API_URL, params, "Error creating project: ", function (err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
};

function updateProject(args, cb) {
  if (args.length < 4) {
    return unknown("Invalid arguments", cb);
  }
  var projectId = args[1];
  var propName = args[2];
  var value = args[3];

  readProject(projectId, function(err, project) {
    if (err) return cb(err);
    project[propName] = value;
    fhreq.PUT(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId, project, function (err, remoteData, raw, response) {
      if (err) return cb(err);
      if (response.statusCode !== 200) return cb(raw);
      return cb(null, remoteData);
    });
  });
};

function readProject(projectId, cb) {
  common.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId, "Error reading Project: ", cb);
};

function deleteProject(args, cb) {
  if (args.length < 2) {
    return unknown("Invalid arguments", cb);
  }
  var endpoint = API_URL + "/" + fhc.appId(args[1]);
  common.doDeleteApiCall(fhreq.getFeedHenryUrl(), endpoint, {},  "Error deleting project: ", function (err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
};

// bash completion
projects.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "projects") argv.unshift("projects");
  if (argv.length === 2) {
    return cb(null, ["create", "update", "read", "delete", "list"]);
  }

  if (argv.length === 3) {
    var action = argv[2];
    switch (action) {
      case "read":
      case "update":
      case "delete":
        common.getProjectIds(cb);
        break;
      default: return cb(null, []);
    }
  }
};
