/* globals i18n */

/* globals i18n */
var ini = require('../../../utils/ini');
var fhc = require("../../../fhc");

module.exports = {
  'desc': i18n._('Undeploy a application.'),
  'examples' : [{ cmd : "fhc app undeploy --appid=<app-id> --apptype=<apptype> --env=<environment>", desc : i18n._('--apptype options:[cloud, embed] Default value is cloud')}],
  'demand' : ['appid','env'],
  'alias' : {
    'appid' : 'a',
    'apptype' : 'at',
    'env' : 'e',
    0 : 'app',
    1 : 'apptype',
    2 : 'env'
  },
  'describe' : {
    'app_id' : i18n._('Unique 24 character GUID of the app you want to undeploy'),
    'apptype' : i18n._('Options:[cloud, embed] - Default value is cloud'),
    'env' : i18n._('Envinronment ID where the application is deployed')
  },
  'preCmd' : function(params, cb){
    var type = params.apptype || "cloud";

    if (type !== "cloud" && !type !== "embed") {
      return cb(i18n._("Invalid argument for --apptype: '"+type+"'"));
    }

    var deployTarget = ini.getEnvironment(params.env);

    var dataObject = {
      guid: fhc.appId(params.appid),
      apptype: type,
      deploytarget: deployTarget
    };

    return cb(undefined, dataObject);
  },
  postCmd : function(reponse, cb){
    if (reponse.result == 'ok') {
      return cb(null, i18n._("Undeploy completed successfully"));
    }
  },
  'url' : function(argv){
    return "box/srv/1.1/environments/" + argv.deploytarget + "/apps/" + argv.guid + "/undeploy";
  },
  'method' : 'post'
};
