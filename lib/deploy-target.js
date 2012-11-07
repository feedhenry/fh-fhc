module.exports = deployTargets;
deployTargets.create = createDeployTarget;
deployTargets.update = updateDeployTarget;
deployTargets.read = readDeployTarget;
deployTargets.list = listDeployTargets;
deployTargets['delete'] = deleteDeployTarget;
deployTargets.listforapp = listAvailableDeployTargets;
deployTargets.getapptarget = getDeployTargetForApp;
deployTargets.setapptarget = setDeployTargetForApp;

deployTargets.usage = "\nfhc deploy-target create name=<the name of the deploy target> platform=<cloudfoundry/stackato/appfog/ironfoundry> env=<dev/live/all> conf_url=<deploy url> conf_username=<user for the deploy> conf_password=<user password for the deploy> [conf_infrastructure=<infrastructure providers>] ..."
                    + "\nfhc deploy-target update id=<id of the deploy target> name=<the name of the deploy target> platform=<cloudfoundry/stackato> env=<dev/live/all> conf_url=<deploy url> conf_username=<user for the deploy> conf_password=<user password for the deploy> ... "
                    + "\nfhc deploy-target read <id of the deployment target>"
                    + "\nfhc deploy-target list"
                    + "\nfhc deploy-target delete <id of the deployment target>"
                    + "\nfhc deploy-target listforapp <appid> <dev/live> [<platform>]"
                    + "\nfhc deploy-target getapptarget <appid> <dev/live>"
                    + "\nfhc deploy-target setapptarget <appid> <id of the deploy target> <dev/live>"
                    + "\n[conf_infrastructure] parameter is required if platform is appfog and possible values are: aws, eu-aws, ap-aws, rs, hp";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');

function deployTargets(args, cb){
  if(args.length == 0){
    return listDeployTargets(cb);
  }
  var action = args[0];
  var params;
  if(args.length > 1){
    params = args.slice(1);
  }
  if(action === "list"){
    return listDeployTargets(cb);
  } else if(action === "create"){
    if(args.length < 7) return cb("Invalid arguments for 'create':" + deployTargets.usage);
    return createDeployTarget(params, cb);
  } else if(action === "update"){
    if(args.length < 2) return cb("Invalid arguments for 'update':" + deployTargets.usage);
    return updateDeployTarget(params, cb);
  } else if(action === "read"){
    if(args.length < 2) return cb("Invalid arguments for 'read':" + deployTargets.usage);
    return readDeployTarget(params, cb);
  } else if(action === "delete"){
    if(args.length < 2) return cb("Invalid arguments for 'delete':" + deployTargets.usage);
    return deleteDeployTarget(params, cb);
  } else if(action === "listforapp"){
    if(args.length < 2) return cb("Invalid arguments for 'listforapp':" + deployTargets.usage);
    return listAvailableDeployTargets(params, cb);
  } else if(action === "getapptarget"){
    if(args.length < 3) return cb("Invalid arguments for 'getapptarget':" + deployTargets.usage);
    return getDeployTargetForApp(params, cb);
  } else if(action === "setapptarget"){
    if(args.length < 3) return cb("Invalid arguments for 'setapptarget':" + deployTargets.usage);
    return setDeployTargetForApp(params, cb);
  } else if(args.length == 1){
    return readDeployTarget(args, cb);
  } else {
    return cb(deployTargets.usage);
  }
}


function listDeployTargets(cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/listeditable", {}, "Error listing deploy targets: ", function(err, targets){
    if(err) return cb(err);
    return cb(undefined, targets);
  });
}

function parseParams(args){
  var paramNameMap = {'name': 'policyId', 'platform':'target', 'env':'env', 'id':'guid'};
  var validInfrastructures = {'aws':'aws.af.cm', 'eu-aws':'eu01.aws.af.cm', 'ap-aws':'ap01.aws.af.cm', 'rs':'rs.af.cm', 'hp':'hp.af.cm'};
  var data = {};
  var conf = {};
  args.forEach(function(arg){
    var pair = arg.split("=");
    var key = pair[0];
    var val = pair[1];
    if(key.indexOf('conf_') > -1){
      var confName = key.replace("conf_", "");
      if(confName === "infrastructure"){
        if(validInfrastructures[val]){
          conf[confName] = validInfrastructures[val];
        } else {
          throw new Error("Invalid infrastructure value : " + val);
        }
      } else {
        conf[confName] = val;
      }
    } else {
      if(paramNameMap[key]){
        data[paramNameMap[key]] = val;
      }
    }
  });
  data['configurations'] = conf;
  var envval = data['env'];
  if("all" == envval){
    data['env'] = "dev,live";
  }
  return data;
}

function createDeployTarget(args, cb){
  var data = parseParams(args);
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/create", data, "Error creating deploy target: ", function(err, target){
    if(err) return cb(err);
    return cb(undefined, target);
  })
}

function updateDeployTarget(args, cb){
  var data = parseParams(args);
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/update", data, "Error updating deploy target: ", function(err, target){
    if(err) return cb(err);
    return cb(undefined, target);
  })
}

function readDeployTarget(args, cb){
  var guid = args[0];
  var data = {'guid': guid};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/read", data, "Error reading deploy target: ", function(err, target){
    if(err) return cb(err);
    return cb(undefined, target);
  })
}

function deleteDeployTarget(args, cb){
  var guid = args[0];
  var data = {'guid': guid};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/delete", data, "Error deleting deploy target: ", function(err, target){
    if(err) return cb(err);
    return cb(undefined, target);
  })
}

function listAvailableDeployTargets(args, cb){
  var appid = fhc.appId(args[0]);
  var env = args[1];
  var platform = undefined;
  if(args.length == 3){
    platform = args[2];
  }

  var data = {"app":appid, "target": platform, "env":env};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/list", data, "Error listing available deploy targets for app : ", function(err, targets){
    if(err) return cb(err);
    return cb(undefined, targets);
  })
}

function getDeployTargetForApp(args, cb){
  var appId = fhc.appId(args[0]);
  var env = args[1];
  var data = {"app": appId, "env": env};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/getpolicy", data, "Error getting deploy target for app : ", function(err, targets){
    if(err) return cb(err);
    return cb(undefined, targets);
  })
}

function setDeployTargetForApp(args, cb){
  var appId = fhc.appId(args[0]);
  var guid = args[1];
  var env = args[2];
  var data = {"app": appId, "policyGuid":guid, "env": env};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/setpolicy", data, "Error setting deploy target for app : ", function(err, targets){
    if(err) return cb(err);
    return cb(undefined, targets);
  })
}

// bash completion
deployTargets.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "deploy-target") argv.unshift("deploy-target");
  if (argv.length === 2) {
    var cmds = ["list", "read", "create", "update", "delete", "listforapp", "getapptarget", "setapptarget"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(undefined, cmds);
  }
}
