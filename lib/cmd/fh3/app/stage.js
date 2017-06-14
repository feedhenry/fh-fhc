/* globals i18n */
var ini = require('../../../utils/ini');
var common = require('../../../common');
var async = require('async');
var fhc = require("../../../fhc");

module.exports = {
  'desc' : i18n._('Stages a cloud application.'),
  'examples' :
  [{
    cmd : 'fhc app stage --app=<cloud-app-id> --env=<environment>',
    desc : i18n._("Deploy of cloud application <app-id> on <environment> (Defaults to branch:master)")
  },{
    cmd : 'fhc app stage --app=<cloud-app-id> --env=<environment> --runtime=<runtime> --clean=false --autodeploy=true',
    desc : i18n._("Deploy of cloud application <cloud-app-id> on <environment> with the <runtime> without Clean Stage option selected and 'Auto Deploy' option selected.")
  },{
    cmd : 'fhc app stage --app=<cloud-app-id> --env=<environment> --runtime=<runtime> --gitRefType=<gitRef-type> --gitRefHash=<gitRef-hash>',
    desc : i18n._("Deploy of cloud application <cloud-app-id> on <environment> with the <runtime> with 'branch' or 'tag' informed and the commit hash that you'd like to deploy.")
  },{
    cmd : 'fhc app stage --app=<cloud-app-id> --env=<environment> --runtime=<runtime> --gitRefValue=<gitRef-value>',
    desc : i18n._("Deploy of cloud application <cloud-app-id> on <environment> with the <runtime> with the name of the branch that you'd like to deploy.")
  }],
  'demand' : ['app', 'env'],
  'method' : 'post',
  'alias' : {
    'app' : 'a',
    'env' : 'e',
    'runtime' : 'r',
    'clean' : 'c',
    'autodeploy': 'ad',
    'gitRefType' : 'gt',
    'gitRefHash' : 'gh',
    'gitRefValue' : 'gv',
    0 : 'app',
    1 : 'env'
  },
  'describe' : {
    'app' : i18n._('Unique 24 character GUID of the cloud app you want to see resource info for'),
    'env' : i18n._('The cloud environment your app is running in'),
    'runtime' : i18n._("The Node.js runtime of your application. (E.g. node08, node010 or node4.). To check the available runtimes use '$fhc app runtimes --id=<cloud-app-id>'"),
    'clean' : i18n._("Options 'true' or 'false'. Do a full, clean stage. Cleans out all old application log files, removes cached node modules and does an 'npm install' from scratch"),
    'autodeploy' : i18n._("Options 'true' or 'false'. Deploy the app automatically when the app repo is updated"),
    'gitRefType' : i18n._("Specifies if you'd like to deploy a 'branch' or 'tag'"),
    'gitRefHash' : i18n._("The commit hash you'd like to deploy if gitRef.type is 'branch'. The default value is HEAD."),
    'gitRefValue' : i18n._("The name of the branch you'd like to deploy")
  },
  'preCmd' : function(params, cb) {
    var data = createData(params);
    data = setDefaultBranchAsMaster(data);
    data = setGitRefValue(params, data);
    data = setGitRefHash(params, data);

    if (params.gitRefType) {
      if (params.gitRefType !== 'branch' && params.gitRefType !== 'tag') {
        return cb(i18n._('Invalid parameter for gitRefType :' + params.gitRefType));
      }
      data.gitRef.type=params.gitRefType;
    }

    if (params.clean && (params.clean.toString() === 'true' || params.clean.toString() === 'false')) {
      data.clean = params.clean;
    } else if (params.clean) {
      return cb(i18n._('Invalid param --clean value:') + params.clean);
    }

    if (params.autodeploy && (params.autodeploy.toString() === 'true' || params.autodeploy.toString() === 'false')) {
      data.autodeploy = params.autodeploy;
    } else if (params.clean) {
      return cb(i18n._('Invalid param --autodeploy value:') + params.autodeploy);
    }

    if (params.runtime) {
      checkRuntimeBeforeDoStage(params,data,cb);
    } else {
      return cb(null, data);
    }
  },
  'url' : function(argv) {
    var domain = ini.get("domain", "user");
    var url = '/api/v2/mbaas/' + domain + '/' + argv.env +'/apps/' + argv.app + '/deploy';
    return url;
  },
  'postCmd' : function(params, cb) {
    async.map([params.cacheKey], common.waitFor, cb);
  }
};

/**
 * Check if the value informed to Runtime is valid or not
 * @param data
 * @param params
 * @returns {*}
 */
function isValidRuntime(data, params) {
  var found = false;
  data.result.forEach(function(entry, index) {
    if (data.result[index].name === params.runtime) {
      found = true;
    }
  });
  return found;
}

/**
 * Define the default branch as Master.
 * It is the same behavior of the NGUI/Studio
 * @param data
 * @returns {*}
 */
function setDefaultBranchAsMaster(data) {
  data.gitRef.type = 'branch';
  data.gitRef.value = 'master';
  data.gitRef.hash = 'HEAD';
  return data;
}

/**
 * If the gitRefValue be informed set this values
 * @param params
 * @param data
 * @returns {*}
 */
function setGitRefValue(params, data) {
  if (params.gitRefValue) {
    data.gitRef.type = 'branch';
    data.gitRef.value = params.gitRefValue;
  }
  return data;
}

/**
 * Set the git Ref Hash.
 * The default value is HEAD
 * @param params
 * @param data
 */
function setGitRefHash(params,data) {
  if (!params.gitRefHash) {
    data.gitRef.hash = params.gitRefHash;
  }
  return data;
}

/**
 * Create the object with all information to perform this operation
 * @returns {{env: (string|*), app: *, gitRef: {}, runtime: (string|*|runtime|{openshift, dev, sp1-openshift, live}|{test, dev, multinode, live})}}
 */
function createData(params) {
  var data = {
    env: params.env,
    app: params.app,
    gitRef: {},
    runtime: params.runtime
  };
  return data;
}

/**
 * Check if the value definied to runtime is valid or not.
 * If yes call perform action to stage/deploy the application
 * @param params
 * @param data
 */
function checkRuntimeBeforeDoStage(params,data,cb) {
  var domain = ini.get("domain");
  fhc.app.runtimes({id: params.app, env: params.env, domain: domain}, function(err, response) {
    if (err) {
      return cb(i18n._('Not found runtime: ' + err));
    } else if (!response || !response.result || response.result.empty) {
      return cb(i18n._('Not found the runtimes for this application.'));
    } else if (!isValidRuntime(response, params)) {
      return cb(i18n._('Invalid parameter for runtime!'));
    } else {
      return cb(null, data);
    }
  });
}