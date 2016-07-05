/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");

module.exports = domains;

domains.desc = i18n._("Manage Domains");
domains.usage = "admin domains create <domainName> <type admin|developer> --theme=<sometheme> --parent=<someparent> ";
domains.perm = "cluster/reseller/customer:write";
function domains(argv, cb) {
  var args = argv._;
  var cmd = args[0];
  if ("create" === cmd) {
    return createDomain(argv, cb);
  } else if ("check" === cmd) {
    return checkDomain(argv, cb);
  }
}

function createDomain(args, cb) {
  var argsArr = args._;
  var domain = argsArr[1],
    type = argsArr[2],
    parent = args.parent,
    theme = args.theme || "";

  if ("admin" !== type && "developer" !== type) {
    cb(i18n._("type must be one of admin or developer"));
  }
  var payload = {"domain": domain, "parent": parent, "type": type, "theme": theme};
  var url = "/box/api/domains";
  common.doApiCall(fhreq.getFeedHenryUrl(), url, payload, i18n._("failed to create cluster user"), cb);
}

function checkDomain(args, cb) {
  var domainToCheck = args[1];
  var url = '/box/api/domains/check?domain=' + domainToCheck;
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, i18n._("Error checking domain availability: "), cb);
}

