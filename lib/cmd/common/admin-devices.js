
module.exports = devices;
devices.list = list;

devices.desc = "Operations specific to devices connected to the MAM App Store";
devices.usage = "\nfhc devices list"
              + "\nfhc devices read <device-id>"
              + "\nfhc devices update <device-id> <label>"
              + "\nfhc devices enable <device-id> <true|false>"
              + "\nfhc devices purgedata <device-id> <true|false>"
              + "\nfhc devices listusers <device-id>"
              + "\nfhc devices listapps <device-id>";

var fhreq = require("../../utils/request");
var common = require("../../common");

// Main devices entry point
function devices (argv, cb) {
  var args = argv._;
  if (args.length === 0){
    return list(cb);
  }

  var action = args[0];
  if (action === 'list') {
    return list(cb);
  }else if (action === 'read'){
    if (args.length !== 2) return cb("Invalid arguments for 'read':" + devices.usage);
    return read(args[1], cb);
  }else if (action === 'update'){
    if (args.length !== 3) return cb("Invalid arguments for 'update':" + devices.usage);
    return update(args[1], args[2], cb);
  }else if (action === 'enable'){
    if (args.length !== 3) return cb("Invalid arguments for 'enable':" + devices.usage);
    return enabledDevice(args[1], args[2], cb);
  }else if (action === 'purgedata'){
    if (args.length !== 3) return cb("Invalid arguments for 'purgedata':" + devices.usage);
    return purgedataDevice(args[1], args[2], cb);
  }else if (action === 'listusers'){
    if (args.length !== 2) return cb("Invalid arguments for 'listusers':" + devices.usage);
    return listusers(args[1], cb);
  }else if (action === 'listapps'){
    if (args.length !== 2) return cb("Invalid arguments for 'listapps':" + devices.usage);
    return listapps(args[1], cb);
  }else if (args.length === 1){
    var deviceId = args[0];
    return read(deviceId, cb);
  }else{
    return cb(devices.usage);
  }
}

// list devices
function list(cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/device/list", {}, "Error listing devices: ", function(err, devices){
    if(err) return cb(err);
    return cb(undefined, devices);
  });
}

function update(id, label, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/device/update", {"cuid": id, "name": label}, "Error updating device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function read(id, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/device/read", {"cuid": id}, "Error reading device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function enabledDevice(id, enabled, cb) {
  var disabled = false;
  if(enabled === "false"){
    disabled = true;
  }
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/device/update", {"cuid": id, "disabled": disabled}, "Error updating device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function purgedataDevice(id, purgedata, cb) {
  var doPurge = false;
  if(purgedata === "true"){
    doPurge = true;
  }
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/device/update", {"cuid": id, "blacklisted": doPurge}, "Error updating device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function listusers(id, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/device/listusers", {"cuid": id}, "Error listing device users: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function listapps(id, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/device/listapps", {"cuid": id}, "Error listing device apps: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// bash completion
devices.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "devices") argv.unshift("devices");
  if (argv.length === 2) {
    var cmds = ["list", "read", "update", "enabled", "purgedata", "listusers", "listapps"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(undefined, cmds);
  }
};
