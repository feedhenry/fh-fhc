/* globals i18n */
var dayInMs = 86400000;
var daysToCache = 1;
var timeout = 2000;
var PATTERN = /\+BUILD-NUMBER/;

var fhc = require('../../fhc'),
  ini = require('../../utils/ini'),
  _ = require('underscore'),
  request = require('request'),
  semver = require('semver'),
  util = require('util');

function cleanupVersion(version) {
  if (PATTERN.test(version)) {
    return version.replace(PATTERN, '');
  }
  return version;
}

module.exports = {
  'desc': i18n._('Version info about the FeedHenry instance we\'re connected to'),
  'examples': [{
    cmd: 'fhc version --format=json',
    desc: i18n._('Displays version in json format')
  }],
  'demand': [],
  'alias': {
    'format': 'format',
    0: 'format'
  },
  'describe': {},
  'url': 'sys/info/version',
  preCmd: function(params, cb) {
    this.format = params.format;
    this.checkFHCUpToDate(function() {
      return cb(null, params);
    });
  },
  postCmd: function(argv, params, cb) {
    if (this.format && this.format.toLowerCase() === 'json') {
      return cb(null, this.getJsonMessage(params));
    } else {
      return cb(null, this.getTextMessage(params));
    }
  },
  getJsonMessage: function(params) {
    var jsonMsg = {};
    jsonMsg.fhcVersion = fhc._version;
    if (params.platform && params.platform.version) {
      jsonMsg.platformVersion = params.platform.version;
    }
    return jsonMsg;
  },
  getTextMessage: function(params) {
    var msg = [];
    var fhcVersionString = i18n._("FHC Version: ") + fhc._version;
    fhcVersionString = (this.latest.is) ? fhcVersionString + i18n._(' (Up to date)') : fhcVersionString;
    msg.push(fhcVersionString);
    if (params.platform && params.platform.version) {
      msg.push(i18n._("FeedHenry Platform Version: ") + params.platform.version);
    }
    if (!this.latest.is) {
      msg.push(this.updateMessage());
    }
    return msg.join('\n');
  },
  checkFHCUpToDate: function(cb) {
    var self = this,
      cachedLatest = ini.get('fhclatest');
    try {
      cachedLatest = JSON.parse(cachedLatest);
    } catch (error) {
      // ignore parse error
    }

    if (!_.isEmpty(cachedLatest) && cachedLatest.current
      && semver.eq(cleanupVersion(cachedLatest.current), cleanupVersion(fhc._version))
      && (cachedLatest.ts - (new Date().getTime() - (dayInMs * daysToCache)) > 0)) {
      self.latest = cachedLatest;
      return cb(cachedLatest.is);
    }

    return this.checkLatestFromServer(cb);
  },
  checkLatestFromServer: function(cb) {
    var self = this;
    var proxyRequest = request.defaults({'proxy': fhc.config.get("proxy"), timeout: timeout});
    proxyRequest.get({
      json: true,
      url: 'http://registry.npmjs.org/fh-fhc/latest'
    }, function(err, response, body) {
      if (err || !body || !body.version) {
        self.errorChecking = true;
        return cb(false);
      }
      var latestV = body.version,
        localV = fhc._version,
        isUpToDate = semver.gte(cleanupVersion(localV), cleanupVersion(latestV));

      self.latest = {
        version: latestV,
        is: isUpToDate,
        ts: new Date().getTime(),
        current: fhc._version
      };

      // Cache the result
      ini.set('fhclatest', JSON.stringify(self.latest), 'user');
      ini.save(function() {
        return cb(isUpToDate);
      });
    });
  },
  updateMessage: function() {
    if (this.errorChecking) {
      return i18n._('Error checking latest version');
    }
    return util.format(i18n._('Warning - newer FHC version available (%s). To update, run\n' +
      'npm install -g fh-fhc'), this.latest.version);
  }
};