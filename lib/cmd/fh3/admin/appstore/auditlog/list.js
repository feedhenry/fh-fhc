/* globals i18n */
var fhreq = require("../../../../../utils/request");
var common = require('../../../../../common.js');
module.exports = {
  'desc' : i18n._('List audit logs for the App Store'),
  'examples' : [{
    cmd : 'fhc admin appstore auditlog list --limit=<limit> --itemId=<itemId> --type=<type> --userId=<userId> --deviceId=<deviceId>"',
    desc : i18n._('List all audit logs and filter the result by <itemId>,<type>,<userId> and <deviceId> and show <limmit> qtd. of results')
  }],
  'demand' : [],
  'alias' : {
    'limit':'l',
    'itemId':'i',
    'type':'t',
    'userId':'u',
    'deviceId':'d',
    'json':'j',
    0 : 'limit',
    1 : 'itemId',
    2 : 'type',
    3 : 'userId',
    4 : 'deviceId'
  },
  'describe' : {
    'limit' : i18n._("Number of the results. Default value is 20"),
    'itemId' : i18n._("Unique 24 character GUID of the Item Store"),
    'type' : i18n._("Type of the Item Store binary.(E.g 'ios')"),
    'userId' : i18n._("Unique user RHMAP user id.(E.g user@rhmap.com)"),
    'deviceId' : i18n._("Unique 24 character GUID of the device"),
    'json' : i18n._('Output into json format')
  },
  'customCmd': function(params, cb) {
    var data = {limit:20};
    if (params.itemId) {
      data["storeItemBinaryGuid"] = params.itemId;
    }
    if (params.type) {
      data["storeItemBinaryType"] = params.type;
    }
    if (params.userId) {
      data["userId"] = params.userId;
    }
    if (params.deviceId) {
      data["deviceId"] = params.deviceId;
    }
    if (params.limit) {
      data["limit"] = params.limit;
    }
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/auditlog/listlogs", data, i18n._("Error Listing log: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!params.json) {
        if ( data && data.list.length > 0) {
          var headers = ["Store Item ID", "Type", "User ID", "Device ID", "Store Item Title"];
          var fields = ["storeItemBinaryGuid", "storeItemBinaryType", "userId", "deviceId", "storeItemTitle"];
          params._table = common.createTableFromArray(headers, fields, data.list);
          return cb(null, params);
        } else {
          return cb(null, i18n._('No audit logs found'));
        }

      }
      return cb(null, data);
    });
  }
};