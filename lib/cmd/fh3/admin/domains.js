var common = require("../../../common");
var fhreq = require("../../../utils/request");

module.exports = domains;

domains.desc = "Manage Domains";
domains.usage= "admin domains create <domainName> <parentGuid (customer or reseller)> <type admin|developer>";
function domains(argv,cb){
    var args = argv._;
    
    var cmd = args[0];
    if("create" == cmd){
      return createDomain(args,cb);
    }
    return cb(null,"args");
    
};



function createDomain(args, cb){
  var domain = args[1],
      parent = args[2],
      type = args[3];
    
    
    if("admin" !== type && "developer" !== type){
       cb("type must be one of admin or developer")
    }
    var payload = {"domain":domain,"parent":parent,"type":type};
    
    var url = "/box/api/domains";
    common.doApiCall(fhreq.getFeedHenryUrl(), url, payload, "failed to create cluster user",function(err, domain){
        if (err) return cb(err);
        return cb(err, domain);
    });
}


