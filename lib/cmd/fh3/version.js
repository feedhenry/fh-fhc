/* globals i18n */
var timeout = process.env.PROXY_REQUEST_TIMEOUT || 15000;
var PATTERN = /\+BUILD-NUMBER/;

var fhc = require('../../fhc'),
  request = require('request'),
  semver = require('semver'),
  util = require('util');

module.exports = {
  'desc': i18n._('Version info about the RHMAP instance we\'re connected to'),
  'examples': [{
    cmd: 'fhc version',
    desc: i18n._('Displays version of FHC and RHMAP')
  }],
  'demand': [],
  'alias': {
    'json': 'j'
  },
  'describe': {
    'json' : i18n._('Output into json format')
  },
  'url': 'sys/info/version',
  'method': 'get',
  'postCmd': function(params, response, cb) {
    var result = {};
    if (response.platform && response.platform.version) {
      result.plataformVersion = response.platform.version;
    }
    var proxyRequest = request.defaults({'proxy': fhc.config.get("proxy")});
    proxyRequest({json: true, url: 'http://registry.npmjs.org/fh-fhc/latest', timeout: timeout}, function(err, res, body) {
      if (err || !body || !body.version) {
        return cb(i18n._('Error checking latest version'));
      }

      result.latestNpmVersion=body.version;
      result.localFHCVersion= fhc._version;
      result.isUpToDate=semver.gte(cleanupVersion(fhc._version), cleanupVersion(body.version));
      result.isLatest=semver.eq(cleanupVersion(fhc._version), cleanupVersion(body.version));

      if (!params.json) {
        var msg = i18n._("FHC Version: ") + result.localFHCVersion ;
        if ( result.isUpToDate ) {
          msg += i18n._(' (Up to date)');
        } else if (!result.isLatest) {
          msg += util.format(i18n._('Warning - newer FHC version available (%s). To update, run\n' +
            - 'npm install -g fh-fhc'), result.latestNpmVersion);
        }
        if (result.plataformVersion) {
          msg += "\n" +  i18n._("RHMAP Version: ") + result.plataformVersion;
        }
        return cb(null, msg);
      }
      return cb(null, result);
    });
  }
};

function cleanupVersion(version) {
  if (PATTERN.test(version)) {
    return version.replace(PATTERN, '');
  }
  return version;
}
