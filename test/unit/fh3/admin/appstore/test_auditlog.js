var assert = require('assert');
var genericCommand = require('genericCommand');
var list = genericCommand(require('cmd/fh3/admin/appstore/auditlog/list.js'));

var nock = require('nock');
var data = {
  "list": [
    {
      "businessObject": "cluster/reseller/customer/domain/admin/app-store/audit-log",
      "deviceId": "",
      "domain": "support",
      "guid": "vvswx5no7mbqhifz6zce2l5u",
      "ipAddress": "187.74.241.47",
      "parentEntity": "AppStoreImpl:teojlet4bcdmmtp3jkanflb2:support~'value",
      "storeItemBinaryGuid": "3a7wyhulrutbqbzuenidqojv",
      "storeItemBinaryType": "android",
      "storeItemBinaryVersion": 2,
      "storeItemGuid": "5w477lfgy3jrnovri7gctsb7",
      "storeItemTitle": "Push",
      "sysCreated": "2017-07-07 10:03:28:117",
      "sysVersion": 0,
      "userGuid": "f3dsfknjiou7orjhpsburuft",
      "userId": "cmacedo@redhat.com"
    },
    {
      "businessObject": "cluster/reseller/customer/domain/admin/app-store/audit-log",
      "deviceId": "",
      "domain": "support",
      "guid": "daxat6aekckafclp2whjnrfb",
      "ipAddress": "187.74.241.47",
      "parentEntity": "AppStoreImpl:teojlet4bcdmmtp3jkanflb2:support~'value",
      "storeItemBinaryGuid": "3a7wyhulrutbqbzuenidqojv",
      "storeItemBinaryType": "android",
      "storeItemBinaryVersion": 2,
      "storeItemGuid": "5w477lfgy3jrnovri7gctsb7",
      "storeItemTitle": "Push",
      "sysCreated": "2017-07-07 10:03:11:489",
      "sysVersion": 0,
      "userGuid": "f3dsfknjiou7orjhpsburuft",
      "userId": "cmacedo@redhat.com"
    }
  ],
  "status": "ok"
};


module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/admin/auditlog/listlogs')
  .times(2)
  .reply(200, data);

module.exports = {
  'test fhc admin appstore auditlog list --json': function(cb) {
    list({json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc admin appstore auditlog list': function(cb) {
    list({}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], '3a7wyhulrutbqbzuenidqojv');
      assert.equal(table['0'][1], 'android');
      assert.equal(table['0'][2], 'cmacedo@redhat.com');
      assert.equal(table['0'][4], 'Push');
      return cb();
    });
  }
};