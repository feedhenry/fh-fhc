var assert = require('assert');
var genericCommand = require('genericCommand');

var devicesCmd = {
  read: genericCommand(require('cmd/fh3/admin/devices/read')),
  list: genericCommand(require('cmd/fh3/admin/devices/list')),
  listapps: genericCommand(require('cmd/fh3/admin/devices/listapps')),
  listusers: genericCommand(require('cmd/fh3/admin/devices/listusers')),
  enable: genericCommand(require('cmd/fh3/admin/devices/enable')),
  disable: genericCommand(require('cmd/fh3/admin/devices/disable')),
  update: genericCommand(require('cmd/fh3/admin/devices/update')),
  purgedata: genericCommand(require('cmd/fh3/admin/devices/purgedata'))
};

var data = {
  "fields": {
    "blacklisted": false,
    "businessObject": "cluster/reseller/customer/domain/admin/app-store/device",
    "cuid": "E7F62D22426F4F95983DACF19986E840",
    "disabled": true,
    "domain": "support",
    "name": "Test",
    "parentEntity": "AppStoreImpl:teojlet4bcdmmtp3jkanflb2:support~'value",
    "sysCreated": "2015-07-31 15:34:40:151",
    "sysGroupFlags": 31,
    "sysGroupList": "",
    "sysModified": "2017-07-14 21:41:32:270",
    "sysShardPoint": 3156789750,
    "sysVersion": 5
  },
  "guid": "xqumt5wyw6dipverrrxsefhy",
  "status": "ok",
  "type": "mam_Devices"
};

var dataList = {
  "count": 20,
  "list": [
  {
    "fields": {
      "blacklisted": false,
      "businessObject": "cluster/reseller/customer/domain/admin/app-store/device",
      "cuid": "C7B25DA8EA544A948A5094BC0CF4BDD8",
      "disabled": false,
      "domain": "support",
      "name": "Device Name",
      "parentEntity": "AppStoreImpl:teojlet4bcdmmtp3jkanflb2:support~'value",
      "sysCreated": "2015-09-29 13:28:58:031",
      "sysGroupFlags": 31,
      "sysGroupList": "",
      "sysModified": "2015-09-29 13:28:58:031",
      "sysShardPoint": 3615202457,
      "sysVersion": 0
    },
    "guid": "255zzgikhwkqcfcbckiqm56f",
    "type": "mam_Devices"
  },
  {
    "fields": {
      "blacklisted": false,
      "businessObject": "cluster/reseller/customer/domain/admin/app-store/device",
      "cuid": "E0CD8EAF59C148CD8038648D1A0DEBF5",
      "disabled": false,
      "domain": "support",
      "name": "",
      "parentEntity": "AppStoreImpl:teojlet4bcdmmtp3jkanflb2:support~'value",
      "sysCreated": "2015-07-30 20:20:41:451",
      "sysGroupFlags": 31,
      "sysGroupList": "",
      "sysModified": "2015-07-31 15:30:27:945",
      "sysShardPoint": 3642863539,
      "sysVersion": 3
    },
    "guid": "3eq27m2mnvzdpt4u4ri7uxvo",
    "type": "mam_Devices"
  }
],
  "status": "ok"
};

var nock = require('nock');

module.exports = nock('https://apps.feedhenry.com')
  .get('/box/srv/1.1/admin/device/list')
  .times(2)
  .reply(200, dataList)
  .post('/box/srv/1.1/admin/device/update')
  .times(6)
  .reply(200, data)
  .post('/box/srv/1.1/admin/device/listapps')
  .reply(200, {})
  .post('/box/srv/1.1/admin/device/listusers')
  .reply(200, {})
  .post('/box/srv/1.1/admin/device/read')
  .reply(200, data);

module.exports = {
  'test fhc admin devices list': function(cb) {
    devicesCmd.list({}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'C7B25DA8EA544A948A5094BC0CF4BDD8');
      assert.equal(table['0'][1], 'Device Name');
      assert.equal(table['0'][2], false);
      assert.equal(table['0'][3], false);
      assert.equal(table['0'][4], 'mam_Devices');
      return cb();
    });
  },
  'test fhc admin devices list --json': function(cb) {
    devicesCmd.list({json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc admin devices disable --cuid': function(cb) {
    devicesCmd.disable({cuid:"E7F62D22426F4F95983DACF19986E840"}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'E7F62D22426F4F95983DACF19986E840');
      assert.equal(table['0'][1], 'Test');
      assert.equal(table['0'][2], false);
      assert.equal(table['0'][3], true);
      assert.equal(table['0'][4], 'mam_Devices');
      return cb();
    });
  },
  'test fhc admin devices disable --cuid --json': function(cb) {
    devicesCmd.disable({cuid:"E7F62D22426F4F95983DACF19986E840", json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc admin devices enable --cuid': function(cb) {
    devicesCmd.enable({cuid:"E7F62D22426F4F95983DACF19986E840"}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'E7F62D22426F4F95983DACF19986E840');
      assert.equal(table['0'][1], 'Test');
      assert.equal(table['0'][2], false);
      assert.equal(table['0'][3], true);
      assert.equal(table['0'][4], 'mam_Devices');
      return cb();
    });
  },
  'test fhc admin devices enable --cuid --json': function(cb) {
    devicesCmd.enable({cuid:"E7F62D22426F4F95983DACF19986E840", json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc admin devices listapps': function(cb) {
    devicesCmd.listapps({cuid:"C7B25DA8EA544A948A5094BC0CF4BDD8"}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  }
  ,
  'test fhc admin devices listusers': function(cb) {
    devicesCmd.listusers({cuid:"C7B25DA8EA544A948A5094BC0CF4BDD8"}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc admin devices purgdata --cuid --backlist --json': function(cb) {
    devicesCmd.purgedata({cuid:"E7F62D22426F4F95983DACF19986E840", json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc admin devices read --cuid': function(cb) {
    devicesCmd.read({cuid:"E7F62D22426F4F95983DACF19986E840"}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'E7F62D22426F4F95983DACF19986E840');
      assert.equal(table['0'][1], 'Test');
      assert.equal(table['0'][2], false);
      assert.equal(table['0'][3], true);
      assert.equal(table['0'][4], 'mam_Devices');
      return cb();
    });
  },
  'test fhc admin devices update --cuid --name': function(cb) {
    devicesCmd.update({cuid:"E7F62D22426F4F95983DACF19986E840", name:"Test"}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'E7F62D22426F4F95983DACF19986E840');
      assert.equal(table['0'][1], 'Test');
      assert.equal(table['0'][2], false);
      assert.equal(table['0'][3], true);
      assert.equal(table['0'][4], 'mam_Devices');
      return cb();
    });
  }
};