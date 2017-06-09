/* globals i18n */
var fhreq = require("../../utils/request");

module.exports = {
  'desc' : i18n._('Command used to call any api endpoint as currently authenticated user'),
  'examples' : [{
    cmd : 'fhc call --url=<url> --method=<method> --data=<data>',
    desc : i18n._('Call the <url> via the <method> with the data=<data>')
  }],
  'demand' : ['url'],
  'alias' : {
    'url':'u',
    'method':'m',
    'data':'d',
    0 : 'url',
    1 : 'method',
    2 : 'data'
  },
  'describe' : {
    'url' : i18n._("URL that you want call"),
    'method' : i18n._("Options: [GET, PUT, POST, DELETE]. Default value is GET"),
    'data' : i18n._("Data in JSON format. (E.g. {name:'name'}")
  },
  'customCmd': function(params, cb) {
    var method = params.method || 'GET';
    var data = params.data || '{}';

    fhreq.requestFunc(fhreq.getFeedHenryUrl(), method, params.url, data, function(err, remoteData, raw, response) {
      if (err) {
        return cb(err);
      }
      if (response.statusCode === 200) {
        if ('object' === typeof remoteData) {
          remoteData.status = "ok";
          remoteData.statusCode = 200;
        } else {
          remoteData = {
            "body": raw,
            "status": "ok",
            "statusCode": response.statusCode
          };
        }
        return cb(err, remoteData);
      }
      return cb(null, {status: 'error', error: remoteData, statusCode: response.statusCode});
    });
  }
};