/* globals i18n */

module.exports = auditlog;
auditlog.desc = i18n._("Audit logs for the MAM App Store");
auditlog.usage = "\nfhc admin-auditlog listlogs [limit=<limit>] [storeItemGuid=<store item guid>] [storeItemBinaryType=<android|iphone>] [userId=<user guid>] [deviceId=<device guid>]";

var fhreq = require("../../utils/request");
var common = require("../../common");

function auditlog(argv, cb){
  var args = argv._;
  if(args.length === 0) return cb(auditlog.usage);
  if(args.length > 0){
    var action = args.shift();
    switch(action){
      case "listlogs":
        return listlogs(args,cb);
      default :
        return cb(auditlog.usage);
    }
  }
}

function listlogs(args,cb){
  var data = {};
  args.forEach(function(arg){
    var pair = arg.split("=");
    data[pair[0]] = parseVal(pair[0],pair[1]);
  });
  if(!data.limit)data.limit = 20;

  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/auditlog/listlogs", data, i18n._("Error Listing log: "), function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function parseVal(name, val){
  if(val === "true"){
    return true;
  }
  if(val === "false"){
    return false;
  }
  return val;
}

// bash completion
auditlog.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "admin-auditlog") argv.unshift("admin-auditlog");
  if (argv.length === 2) {
    var cmds = ["listlogs"];
    if (opts.partialWord !== "l") cmds.push("listlogs");
    return cb(undefined, cmds);
  }
  return cb(null, []);
};
