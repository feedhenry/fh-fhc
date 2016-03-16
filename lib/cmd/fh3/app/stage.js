var base = require('./_baseCloudCommand.js')('stage'),
ini = require('../../../utils/ini'),
common = require('../../../common'),
async = require('async');
base.desc = "Stages a cloud application.";
base.url = function(argv){
  var domain = ini.get("domain", "user");
  var url = '/api/v2/mbaas/' + domain + '/' + argv.env +'/apps/' + argv.app + '/deploy';
  return url;
};
base.method = 'post';
base.describe.runtime = "The Node.js runtime of your application, e.g. node06 or node08 or node010";
base.describe.clean = "Do a full, clean stage. Cleans out all old application log files, removes cached node modules and does an 'npm install' from scratch";
base.describe.autodeploy = "Deploy the app automatically when the app repo is updated";
base.describe['gitRef.type'] = "Specifies if you'd like to deploy a 'branch' or 'tag'";
base.describe['gitRef.hash'] = "The commit hash you'd like to deploy if gitRef.type is 'branch'. HEAD will use the latest code for that branch";
base.describe['gitRef.value'] = "The name of the branch you'd like to deploy";
base.alias.runtime = "r";
base.alias.clean = "c";
base.alias.autodeploy = "d";
base.preCmd = function(argv, cb){
  var data = {
    env: argv.env,
    app: argv.app,
    gitRef: argv.gitRef
  };
  if (argv.runtime){
    data.runtime = argv.runtime;
  }
  if (argv.clean){
    data.clean = argv.clean === 'true';
  }
  if (argv.autodeploy){
    data.autoDeploy = argv.autodeploy !== 'false';
  }
  return cb(null, data);
};
base.postCmd = function(params, cb){
  async.map([params.cacheKey], common.waitFor, cb);
};
module.exports = base;
