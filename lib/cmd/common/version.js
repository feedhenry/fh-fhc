var fhc = require('../../fhc'),
  ini = require('../../utils/ini'),
  _ = require('underscore'),
  request = require('request'),
  semver = require('semver');
const dayInMs = 86400000;
const daysToCache = 1;
const timeout = 2000;
const PATTERN = /\+BUILD-NUMBER/;

function cleanupVersion(version){
  if(PATTERN.test(version)){
    return version.replace(PATTERN, '');
  }
  return version;
}

module.exports = {
  'desc': 'Version info about the FeedHenry instance we\'re connected to',
  'examples': [{
    cmd: 'fhc version',
    desc: ''
  }],
  'demand': [],
  'alias': {},
  'describe': {},
  'url': 'box/srv/1.1/tst/version',
  preCmd: function(params, cb) {
    this.checkFHCUpToDate(function() {
      return cb(null, params);
    });
  },
  postCmd: function(params, cb) {
    var msg = [],
      fhcVersionString = "FHC Version: " + fhc._version;
    fhcVersionString = (this.latest.is) ? fhcVersionString + ' (Up to date)' : fhcVersionString;
    msg.push("FeedHenry Product Version: " + fhc.config.get('fhversion'));
    msg.push("FeedHenry " + params.Environment + " " + params.Release);
    msg.push(fhcVersionString);
    if (!this.latest.is) {
      msg.push(this.updateMessage());
    }
    return cb(null, msg.join('\n'));
  },
  checkFHCUpToDate: function(cb) {
    var self = this,
      cachedLatest = ini.get('fhclatest');
    try {
      cachedLatest = JSON.parse(cachedLatest)
    } catch (error) {}
    if (!_.isEmpty(cachedLatest)) {
      if(cachedLatest.current && semver.eq(cleanupVersion(cachedLatest.current), cleanupVersion(fhc._version))){
        if (cachedLatest.ts - (new Date().getTime() - (dayInMs * daysToCache)) > 0) {
          self.latest = cachedLatest;
          return cb(cachedLatest.is);
        }
      }
    }

    return this.checkLatestFromServer(cb);
  },
  checkLatestFromServer: function(cb) {
    var self = this;
    request.get({
      proxy: ini.get('proxy'),
      json: true,
      url: 'http://registry.npmjs.org/fh-fhc/latest-1',
      timeout: timeout
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
      return 'Error checking latest version';
    }
    return 'Warning - newer FHC version available (' + this.latest.version + '). To update, run\n' +
      'npm install -g fh-fhc';
  }
};