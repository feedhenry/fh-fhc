var async = require('async'),
  _ = require('underscore'),
  urlUtils = require('url'),
  fhc = require('./fhc'),
  request = require('request').defaults({'proxy': fhc.config.get("proxy")}),
  path = require('path'),
  fhreq = require('./utils/request'),
  log = require("./utils/log"),
  os = require('os');

function _buildUsage(cmd) {
  var usage = ['Usage:\n'];

  // Figure out what the full command is
  var fullCmd = cmd._path.split(path.sep);
  fullCmd.shift(); // get rid of the first directory - the 'fh3' or 'fh2' or 'common' or whatever
  fullCmd[fullCmd.length - 1] = cmd._cmdName;
  fullCmd = ['fhc'].concat(fullCmd);
  usage.push(fullCmd.join(' '));

  // Generate rest of usage from the command description
  _.each(cmd.describe, function (description, key) {
    var argument = "";
    argument = "--" + key + "=" + "<" + key + ">";

    // Optional params are wrapped in []'s'
    if (cmd.demand.indexOf(key) === -1) {
      argument = "[" + argument + "]";
    }
    usage.push(argument);
  });

  return usage.join(' ');
}

function _handleRequestGenerically(params, cb) {
  var url = this.url,
    headers = {},
    method = this.method,
    cookie = fhc.config.get("cookie");

  if (typeof cookie !== 'undefined') {
    headers.cookie = "feedhenry=" + cookie + ";";
  }
  if (typeof url === 'function') {
    url = url(params);
  }
  headers['User-Agent'] = "FHC/" + fhc._version + ' ' + os.platform() + '/' + os.release();
  log.verbose(headers, "getHeaders");

  var fhUrl = fhreq.getFeedHenryUrl();
  if (fhUrl instanceof Error) {
    return cb(fhUrl);
  }

  var opts = {
    url: urlUtils.resolve(fhUrl, url),
    headers: headers,
    method: method,
    proxy: fhc.config.get("proxy"),
    body: (method === 'get' || method === 'delete') ? undefined : params,
    json: true
  };

  request(opts, function (err, response, body) {
    if (err) {
      return cb(err.toString());
    }

    if (response.statusCode.toString()[0] !== '2') {
      var msg = 'Error - not 2xx status code.\n';
      msg += JSON.stringify(body);
      return cb(msg);
    }
    return cb(null, body);
  });
}

module.exports = function (cmd) {
  cmd.usage = _buildUsage(cmd);

  var cmdFn = function (argv, cb) {
    var preCmd = cmd.preCmd,
      customCmd = cmd.customCmd,
      postCmd = cmd.postCmd,
      series = [];

    // Ensure our series always gets the args as the first param in the chain, regardless of if we have a preFn or not
    series.push(function (cb) {
      return cb(null, argv);
    });

    if (typeof preCmd === 'function') {
      // Apply a useful scope in these functions
      var pre = function (params, cb) {
        preCmd.apply(cmd, [params, cb]);
      };
      series.push(pre);
    }

    if (typeof customCmd === 'function') {
      // Allow to reuse standard request function in custom command.
      cmd.executeStandardRequest = _.bind(_handleRequestGenerically, cmd);
      // Apply a useful scope
      var custom = function (params, cb) {
        customCmd.apply(cmd, [params, cb]);
      };
      series.push(custom);
    } else {
      series.push(function (params, cb) {
        return _handleRequestGenerically.apply(cmd, [params, cb]);
      });
    }

    if (typeof postCmd === 'function') {
      // Apply a useful scope in these functions
      var post = function (params, cb) {
        postCmd.apply(cmd, [params, cb]);
      };
      series.push(post);
    }

    return async.waterfall(series, cb);
  };

  _.extend(cmdFn, cmd); // Applies things like .usage, .desc so we can access them later
  return cmdFn;
};
