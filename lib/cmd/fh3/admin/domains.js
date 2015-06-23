var common = require("../../../common");
var fhreq = require("../../../utils/request");

module.exports = domains;

domains.desc = "Manage Domains";
domains.usage= "admin domains create <domainName> <type admin|developer> --theme=<sometheme> --parent=<someparent> ";
domains.perm = "cluster/reseller/customer:write";
function domains(argv,cb){
    var args = argv._;

    var cmd = args[0];
    if("create" === cmd){
      return createDomain(argv,cb);
    }
    else if("check" === cmd){
        return checkDomain(argv,cb);
    }

}



function createDomain(args, cb){
    var argsArr = args._;
  var domain = argsArr[1],
      type = argsArr[2],
      parent = args.parent,
      theme = args.theme || "";


    if("admin" !== type && "developer" !== type){
       cb("type must be one of admin or developer")
    }
    var payload = {"domain":domain,"parent":parent,"type":type,"theme":theme};

    var url = "/box/api/domains";
    common.doApiCall(fhreq.getFeedHenryUrl(), url, payload, "failed to create cluster user",function(err, domain){
        if (err) return cb(err);
        return cb(err, domain);
    });
}


function checkDomain(args,cb){
    var domainToCheck = args[1];
    var url = '/box/api/domains/check?domain=' + domainToCheck;
    common.doGetApiCall(fhreq.getFeedHenryUrl(), url, "Error checking domain availability: ", function(err, res) {
        cb(err,res);
    });
}

