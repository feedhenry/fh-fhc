/* globals i18n */
module.exports = cluster;

cluster.desc = i18n._("Manage cluster");
cluster.usage = " fhc admin cluster \n fhc admin cluster read \n fhc admin cluster user create <username> <pass> [email address]" +
  "\n fhc admin cluster user update [username=<new username> | email=<new email> | pass=<new password>]" +
  "\n fhc admin cluster user read <guid> [--teams=true|false]" +
  "\n fhc admin cluster users [--teams=true] ";
cluster.perm = "cluster:read"; //fl

var ini = require('../../utils/ini');
var common = require("../../common");
var fhreq = require("../../utils/request");

function cluster(argv, cb) {
  var args = argv._;
  if ("read" === args[0]) {
    return read(cb);
  } else if ("user" === args[0] && "create" === args[1]) {
    return userCreate(args, cb);
  } else if ("users" === args[0]) {
    return userList(args, cb);
  } else if ("user" === args[0] && "read" === args[1]) {
    return userRead(args, cb);
  } else if ("user" === args[0] && "update" === args[1]) {
    return userUpdate(args, cb);
  } else {
    cb(cluster.usage);
  }
}

function read(cb) {
  var url = '/box/api/clusters?tree=true';
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, i18n._("Error reading Cluster Props: "), function (err, cluster) {
    return cb(null, cluster);
  });
}

function userCreate(args, cb) {
  var user = args[2];
  var pass = args[3];
  var email = args[4];

  if (!user) {
    return cb("username required");
  }
  if (!pass) {
    return cb("pass required");
  }

  var payload = {"name": user, "pass": pass};

  if (email) {
    payload.email = email;
  }
  var url = "/box/api/clusters/users";
  common.doApiCall(fhreq.getFeedHenryUrl(), url, payload, i18n._("failed to create cluster user"), function (err, user) {
    if (err) {
      return cb(err);
    }
    return cb(err, user);
  });
}

function userList(args, cb) {
  var url = "/box/api/clusters/users";
  var teams = ini.get("teams");
  if (teams) {
    url += "?teams=true";
  }
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, i18n._("failed to create cluster user"), function (err, users) {
    if (err) {
      return cb(err);
    }
    return cb(err, users);
  });
}

function userRead(args, cb) {
  var uid = args[2];
  var url = "/box/api/clusters/users/" + uid + "?teams=true";
  var teams = ini.get("teams");
  if (teams) {
    url += "?teams=true";
  }
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, i18n._("failed to read cluster user"), function (err, users) {
    if (err) {
      return cb(err);
    }
    return cb(err, users);
  });
}

function userUpdate(args, cb) {
  var guid = args[2];

  var params = {};
  for (var i = 2; i < args.length; i++) {
    if (args[i] && args[i].indexOf("=") !== -1) {
      var kv = args[i].split("=");
      params[kv[0]] = kv[1];
    }
  }

  var user = params["username"];
  var pass = params["pass"];
  var email = params["email"];
  var payload;
  if (!guid) {
    return cb("guid is required");
  }
  if (user) {
    payload = {};
    payload.name = user;
  }
  if (pass) {
    if (!payload) {
      payload = {};
    }
    payload.pass = pass;
  }

  if (email) {
    if (!payload) {
      payload = {};
    }
    payload.email = email;
  }
  if (!payload) {
    return cb(i18n._("not updating anything? "));
  }

  var url = "/box/api/clusters/users/" + guid;
  common.doPutApiCall(fhreq.getFeedHenryUrl(), url, payload, function (err, user) {
    if (err) {
      return cb(err);
    }
    return cb(err, user);
  });
}
