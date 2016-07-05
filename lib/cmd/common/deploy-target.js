/* globals i18n */
module.exports = deployTargets;
deployTargets.create = createDeployTarget;
deployTargets.update = updateDeployTarget;
deployTargets.read = readDeployTarget;
deployTargets.list = listDeployTargets;
deployTargets['delete'] = deleteDeployTarget;
deployTargets.listforapp = listAvailableDeployTargets;
deployTargets.getapptarget = getDeployTargetForApp;
deployTargets.setapptarget = setDeployTargetForApp;

deployTargets.desc = i18n._("Operations on Cloud Deploy Targets");
deployTargets.usage = "\nfhc deploy-target create name=<the name of the deploy target> platform=<cloudfoundry/stackato/appfog/ironfoundry> conf_url=<deploy url> conf_username=<user for the deploy> conf_password=<user password for the deploy> --env=<environment> [conf_infrastructure=<infrastructure providers>] ..."
                    + "\nfhc deploy-target update id=<id of the deploy target> name=<the name of the deploy target> platform=<cloudfoundry/stackato> conf_url=<deploy url> conf_username=<user for the deploy> conf_password=<user password for the deploy> --env=<environment> ... "
                    + "\nfhc deploy-target read <id of the deployment target>"
                    + "\nfhc deploy-target list"
                    + "\nfhc deploy-target delete <id of the deployment target>"
                    + "\nfhc deploy-target listforapp <appid> [<platform>] --env=<environment>"
                    + "\nfhc deploy-target getapptarget <appid> --env=<environment>"
                    + "\nfhc deploy-target setapptarget <appid> <id of the deploy target> --env=<environment>"
                    + i18n._("\n[conf_infrastructure] parameter is required if platform is appfog and possible values are: aws, eu-aws, ap-aws, rs, hp");

var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var ini = require('../../utils/ini');
var common = require("../../common");
var util = require('util');

function errorMessageString(action) {
  return util.format(i18n._("Invalid arguments for '%s':"), action);
}

function deployTargets(argv, cb){
  var args = argv._;
  if(argv._.length === 0){
    return listDeployTargets(cb);
  }
  var action = argv._[0];
  if(argv._.length > 1){
    argv._ = argv._.slice(1);
  }
  if(action === "list"){
    return listDeployTargets(cb);
  } else if(action === "create"){
    if(args.length < 6) {
      return cb(errorMessageString(action) + deployTargets.usage);
    }
    return createDeployTarget(argv, cb);
  } else if(action === "update"){
    if(args.length < 2) {
      return cb(errorMessageString(action) + deployTargets.usage);
    }
    return updateDeployTarget(argv, cb);
  } else if(action === "read"){
    if(args.length < 2) {
      return cb(errorMessageString(action) + deployTargets.usage);
    }
    return readDeployTarget(argv, cb);
  } else if(action === "delete"){
    if(args.length < 2) {
      return cb(errorMessageString(action) + deployTargets.usage);
    }
    return deleteDeployTarget(argv, cb);
  } else if(action === "listforapp"){
    if(args.length < 2) {
      return cb(errorMessageString(action) + deployTargets.usage);
    }
    return listAvailableDeployTargets(argv, cb);
  } else if(action === "getapptarget"){
    if(args.length < 2) {
      return cb(errorMessageString(action) + deployTargets.usage);
    }
    return getDeployTargetForApp(argv, cb);
  } else if(action === "setapptarget"){
    if(args.length < 3) {
      return cb(errorMessageString(action) + deployTargets.usage);
    }
    return setDeployTargetForApp(argv, cb);
  } else if(args.length === 1){
    return readDeployTarget(argv, cb);
  } else {
    return cb(deployTargets.usage);
  }
}


function listDeployTargets(cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/listeditable", {}, i18n._("Error listing deploy targets: "), function(err, targets){
    if(err) {
      return cb(err);
    }
    return cb(undefined, targets);
  });
}

function parseParams(argv){
  var args = argv._;
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
          throw new Error(i18n._("Invalid infrastructure value : ") + val);
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
  var envval = ini.getEnvironment(argv);
  if("all" === envval){
    envval = "dev,live"; //TODO: How will this scale to new environments? Could MC take an envval='*'?
  }
  data['env'] = envval;
  return data;
}

function createDeployTarget(argv, cb){
  var data = parseParams(argv);
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/create", data, i18n._("Error creating deploy target: "), function(err, target){
    if(err) {
      return cb(err);
    }
    return cb(undefined, target);
  });
}

function updateDeployTarget(argv, cb){
  var data = parseParams(argv);
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/update", data, i18n._("Error updating deploy target: "), function(err, target){
    if(err) {
      return cb(err);
    }
    return cb(undefined, target);
  });
}

function readDeployTarget(argv, cb){
  var args = argv._;
  var guid = args[0];
  var data = {'guid': guid};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/read", data, i18n._("Error reading deploy target: "), function(err, target){
    if(err) {
      return cb(err);
    }
    return cb(undefined, target);
  });
}

function deleteDeployTarget(argv, cb){
  var args = argv._;
  var guid = args[0];
  var data = {'guid': guid};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/delete", data, i18n._("Error deleting deploy target: "), function(err, target){
    if(err) {
      return cb(err);
    }
    return cb(undefined, target);
  });
}

function listAvailableDeployTargets(argv, cb){
  var args = argv._;
  var appid = fhc.appId(args[0]);
  var env = ini.getEnvironment(argv);
  var platform;

  if(args.length === 2){
    platform = args[1];
  }

  var data = {"app":appid, "target": platform, "env":env};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/list", data, i18n._("Error listing available deploy targets for app : "), function(err, targets){
    if(err) {
      return cb(err);
    }
    return cb(undefined, targets);
  });
}

function getDeployTargetForApp(argv, cb){
  var args = argv._;
  var appId = fhc.appId(args[0]);
  var env = ini.getEnvironment(argv);
  var data = {"app": appId, "env": env};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/getpolicy", data, i18n._("Error getting deploy target for app : "), function(err, targets){
    if(err) {
      return cb(err);
    }
    return cb(undefined, targets);
  });
}

function setDeployTargetForApp(argv, cb){
  var args = argv._;
  var appId = fhc.appId(args[0]);
  var guid = args[1];
  var env = ini.getEnvironment(argv);
  var data = {"app": appId, "policyGuid":guid, "env": env};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/cm/deploy/policy/setpolicy", data, i18n._("Error setting deploy target for app : "), function(err, targets){
    if(err) {
      return cb(err);
    }
    return cb(undefined, targets);
  });
}

// bash completion
deployTargets.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "deploy-target") argv.unshift("deploy-target");
  if (argv.length === 2) {
    var cmds = ["list", "read", "create", "update", "delete", "listforapp", "getapptarget", "setapptarget"];
    if (opts.partialWord !== "l") {
      cmds.push("list");
    }
    return cb(undefined, cmds);
  }
};
