/* globals i18n */
module.exports = groups;
groups.list = list;

groups.desc = i18n._("Administer App Store Item Groups in the MAM App Store");
groups.usage = "\nfhc storeitemgroups list"
  + "\nfhc storeitemgroups create <group-name> <group-description>"
  + "\nfhc storeitemgroups delete <group-guid>"
  + "\nfhc storeitemgroups read <group-guid>"
  + "\nfhc storeitemgroups readByName <group-name>"
  + "\nfhc storeitemgroups update <group-guid> <group-name> <group-description>"
  + "\nfhc storeitemgroups addusers <group-guid> <user-email>*"
  + "\nfhc storeitemgroups removeusers <group-guid> <user-email>*"
  + "\nfhc storeitemgroups addstoreitems <group-guid> <storeitem-id>*"
  + "\nfhc storeitemgroups removestoreitems <group-guid> <storeitem-id>*";

var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var async = require('async');
var util = require('util');

function errorMessageString(action) {
  return util.format(i18n._("Invalid arguments for '%s':"), action);
}

// Main groups entry point
function groups(argv, cb) {
  var args = argv._;
  if (args.length === 0) {
    return list(cb);
  }

  var action = args[0];
  if (action === 'list') {
    return list(cb);
  } else if (action === 'create') {
    if (args.length !== 3) return cb(errorMessageString(action) + groups.usage);
    return create(args[1], args[2], cb);
  } else if (action === 'read') {
    if (args.length !== 2) return cb(errorMessageString(action) + groups.usage);
    return read(args[1], cb);
  } else if (action === 'readByName') {
    if (args.length !== 2) return cb(errorMessageString(action) + groups.usage);
    return readByName(args[1], cb);
  } else if (action === 'update') {
    if (args.length !== 4) return cb(errorMessageString(action) + groups.usage);
    return update(args[1], args[2], args[3], cb);
  } else if (action === 'delete') {
    if (args.length !== 2) return cb(errorMessageString(action) + groups.usage);
    return deleteGroup(args[1], cb);
  } else if (action === 'addusers') {
    if (args.length <= 2) return cb(errorMessageString(action) + groups.usage);
    args.shift(); // Action
    var groupGuidToAdd = args.shift();
    return addusers(groupGuidToAdd, args, cb);
  } else if (action === 'removeusers') {
    if (args.length <= 2) return cb(errorMessageString(action) + groups.usage);
    args.shift(); // Action
    var groupGuidToRemove = args.shift();
    return removeusers(groupGuidToRemove, args, cb);
  } else if (action === 'addstoreitems') {
    if (args.length <= 2) return cb(errorMessageString(action) + groups.usage);
    args.shift(); // Action
    var groupGuidStore = args.shift();
    return addstoreitems(groupGuidStore, args, cb);
  } else if (action === 'removestoreitems') {
    if (args.length <= 2) return cb(errorMessageString(action) + groups.usage);
    args.shift(); // Action
    var groupGuidRemoveStore = args.shift();
    return removestoreitems(groupGuidRemoveStore, args, cb);
  } else if (args.length === 1) {
    var appId = fhc.appId(args[0]);
    return read(appId, cb);
  } else {
    return cb(util.format(i18n._("Unknown command '%s'."), action) + ' ' + i18n._("Usage: ") + groups.usage);
  }
}

// list groups
function list(cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/list", {}, i18n._("Error listing groups: "), function (err, groups) {
    if (err) return cb(err);
    return cb(undefined, groups);
  });
}

// create user
function create(name, desc, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/create", {
    "name": name,
    "description": desc
  }, i18n._("Error creating group: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
}

// delete group
function deleteGroup(id, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/delete", {"guid": id}, i18n._("Error deleting group: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
}

// read group
function read(id, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/read", {"guid": id}, i18n._("Error reading group: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
}

function readByName(name, cb) {
  list(function (err, groups) {
    if (err) return cb(err);
    for (var i = 0; i < groups.list.length; i++) {
      var group = groups.list[i];
      if (group.name === name) {
        common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/read", {"guid": group.guid}, i18n._("Error reading group: "), function (err, data) {
          if (err) return cb(err);
          var storeitems = data.storeitems;
          var users = data.users;
          var retStoreItems = [];
          var retUsers = [];
          async.parallel([
            function (callback) {
              common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/list", {}, i18n._("Error listing storeitems: "), function (sierr, sidata) {
                if (sierr) return callback(sierr);
                sidata.list.forEach(function (item) {
                  if (storeitems.indexOf(item.guid) > -1) {
                    retStoreItems.push(item.name);
                  }
                });
                callback(undefined, 0);
              });
            },
            function (callback) {
              common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/list", {}, i18n._("Error listing users: "), function (uerr, udata) {
                if (uerr) return callback(uerr);
                udata.list.forEach(function (item) {
                  if (users.indexOf(item.guid) > -1) {
                    retUsers.push({email: item.fields.email, name: item.fields.name});
                  }
                });
                callback(undefined, 0);
              });
            }
          ], function (err) {
            if (err) return cb(err);
            data.storeitems = retStoreItems;
            data.users = retUsers;
            return cb(undefined, data);
          });
        });
      } else {
        if (i === groups.list.length - 1) {
          return cb(util.format(i18n._("Can not find group with name %s"), name));
        } else {
          continue;
        }
      }
    }
  });
}

// update group
function update(id, name, desc, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/update", {
    "guid": id,
    "description": desc,
    "name": name
  }, i18n._("Error updating group: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
}

// add users to a group
function addusers(id, users, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/addusers", {
    "guid": id,
    "users": users
  }, i18n._("Error adding users: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
}

// remove users from a group
function removeusers(id, users, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/removeusers", {
    "guid": id,
    "users": users
  }, i18n._("Error removing users: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
}

// add store items to a group
function addstoreitems(id, storeitems, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/addstoreitems", {
    "guid": id,
    "storeitems": storeitems
  }, i18n._("Error adding apps: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
}

// remove store items from a group
function removestoreitems(id, storeitems, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/removestoreitems", {
    "guid": id,
    "storeitems": storeitems
  }, i18n._("Error removing apps: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
}

// bash completion
groups.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "admin-storeitemgroups") argv.unshift("admin-storeitemgroups");
  if (argv.length === 2) {
    var cmds = ["list", "read", "readByName", "create", "update", "delete", "addapps", "removeapps", "addusers", "removeusers"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(undefined, cmds);
  }
  var action = argv[2];
  switch (action) {
    case "addapps":
      common.getAppIds(cb);
      break;
    default:
      return cb(null, []);
  }
};
