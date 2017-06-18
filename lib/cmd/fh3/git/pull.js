/* globals i18n */
var millicore = require("../../../utils/millicore.js");
var common = require("../../../common");
var fhreq = require("../../../utils/request");

module.exports = {
  'desc' : i18n._('Pull application'),
  'examples' :
    [{
      cmd : 'fhc git pull --app=<app> [--clean] [--json]',
      desc : i18n._('Git pull the <app>')
    }],
  'demand' : ['app'],
  'alias' : {
    'app':'a',
    'domain':'domain',
    'clean':'c',
    'json':'j',
    0 : 'app'
  },
  'describe' : {
    'app' : i18n._('Unique 24 character GUID of the application'),
    'clean' : i18n._('Clean the application before pull'),
    'json' : i18n._('Output into json format')
  },
  'customCmd': function(params, cb) {
    millicore.widgForAppId(params.app, function(err, widgId) {
      if (params.clean) {
        cleanBeforePull(params,widgId,cb);
      } else {
        pull(params,widgId,cb);
      }
    });
  }
};

/**
 * Do the pull of the application <app>
 * @param app
 * @param widgId
 * @param cb
 */
function pull(params,widgId,cb) {
  var payload = {
    payload: {
      guid:params.app
    }
  };
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/pub/app/" + widgId + "/refresh", payload, i18n._("Error in Git pull: "), function(err, data) {
    if (err) {
      return cb(err);
    }
    if (data.status !== 'ok') {
      if (!params.json) {
        return cb(i18n._("Error in Git pull: ") + data.error);
      }
      return cb(data.error);
    }
    if (data.cacheKey) {
      return common.waitFor(data.cacheKey, function(err, data) {
        if (err) {
          return cb(err);
        }
        if (data[0] && data[0].log && data[0].log[0]) {
          if ( !params.json ) {
            return cb(null, data[0].log.join(' '));
          } else {
            return cb(null, data[0]);
          }

        }
        return cb(null, data);
      });
    }
    return cb(null, data);
  });
}


function cleanBeforePull(params,widgId,cb) {
  var payload = {
    clean: true
  };

  fhreq.POST(fhreq.getFeedHenryUrl(), '/box/api/projects/' + widgId + '/apps/' + params.app + '/pull', payload, function(err, data) {
    if (err) {
      return cb(err);
    } else if (!data.cacheKeys) {
      var errMessage = i18n._('Error in cleaning the application, unexpected response format');
      if (!params.json) {
        return cb(i18n._('Error in cleaning the application, unexpected response format'));
      } else {
        return cb({message:errMessage, status:'error'});
      }
    } else {
      // Now we need to do the actual pull
      pull(params, widgId, cb);
    }
  });
}