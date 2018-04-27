var assert = require('assert');
var genericCommand = require('genericCommand');
var artifacts = genericCommand(require('cmd/fh3/artifacts'));

var nock = require('nock');


var data = [{
  "appId": "invchzzsworx3qvnko6tvvpf",
  "appVersion": 3,
  "buildId": "7143a3f0-3609-468e-ba1e-9c59abb0e8f6",
  "businessObject": "cluster/reseller/customer/domain/project/client-apps/binary",
  "credential": "",
  "destination": "android",
  "destversion": "4.0",
  "domain": "support",
  "downloadurl": "https://support.us.feedhenry.com/digman/android-v3/dist/7143a3f0-3609-468e-ba1e-9c59abb0e8f6/android~4.0~3~CordovaApp.apk?digger=diggers.sam1-farm2-linux1",
  "env": "dev",
  "gitRef": {
    "hash": "14e69341baf7bdf8335b57fc80add167ad53f065",
    "type": "branch",
    "value": "master"
  },
  "guid": "cytypb6zakub2kpt7eh5pc4j",
  "isBuild": true,
  "mamProvider": "",
  "message": "",
  "otaurl": "https://support.us.feedhenry.com/digman/android-v3/dist/7143a3f0-3609-468e-ba1e-9c59abb0e8f6/android~4.0~3~CordovaApp.apk?digger=diggers.sam1-farm2-linux1",
  "parentEntity": "TemplateInstanceImpl:invchzzsworx3qvnko6tvvpf:1495204921233~invchzzwmwnpwehmy54roimi~support~Cordova App:parentGuid=invchzzwmwnpwehmy54roimi:parentType=widg_Widget",
  "released": false,
  "status": "finished",
  "sub": "i4ze7ruomd27wnohth22to4v",
  "sysCreated": "2017-05-19 14:42:01:891",
  "sysGroupFlags": 65567,
  "sysGroupList": "",
  "sysModified": "2017-05-19 14:42:49:362",
  "sysShardPoint": 371689351,
  "sysVersion": 2,
  "type": "debug"
},
  {
    "appId": "invchzzsworx3qvnko6tvvpf",
    "appVersion": 2,
    "buildId": "ef08842c-694f-40d1-85b2-ab7fac1d6c3a",
    "businessObject": "cluster/reseller/customer/domain/project/client-apps/binary",
    "credential": "",
    "destination": "android",
    "destversion": "4.0",
    "domain": "support",
    "downloadurl": "https://support.us.feedhenry.com/digman/android-v3/dist/ef08842c-694f-40d1-85b2-ab7fac1d6c3a/android~4.0~2~CordovaApp.apk?digger=diggers.sam1-farm2-linux2",
    "env": "dev",
    "gitRef": {
      "hash": "14e69341baf7bdf8335b57fc80add167ad53f065",
      "type": "branch",
      "value": "master"
    },
    "guid": "4eoea3zluatdlpmm37ht2p2x",
    "isBuild": true,
    "mamProvider": "",
    "message": "",
    "otaurl": "https://support.us.feedhenry.com/digman/android-v3/dist/ef08842c-694f-40d1-85b2-ab7fac1d6c3a/android~4.0~2~CordovaApp.apk?digger=diggers.sam1-farm2-linux2",
    "parentEntity": "TemplateInstanceImpl:invchzzsworx3qvnko6tvvpf:1495204921233~invchzzwmwnpwehmy54roimi~support~Cordova App:parentGuid=invchzzwmwnpwehmy54roimi:parentType=widg_Widget",
    "released": false,
    "status": "finished",
    "sub": "i4ze7ruomd27wnohth22to4v",
    "sysCreated": "2017-05-19 13:38:00:872",
    "sysGroupFlags": 65567,
    "sysGroupList": "",
    "sysModified": "2017-05-19 13:38:49:241",
    "sysShardPoint": 3776725103,
    "sysVersion": 2,
    "type": "debug"
  }];

module.exports = nock('https://apps.feedhenry.com')
  .get('/box/srv/1.1/artifacts?isBuild=true&appId=1a')
  .reply(200, data);


module.exports = {
  'test artifacts app': function(cb) {
    artifacts({app:'1a'}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'android');
      assert.equal(table['0'][1], '3');
      assert.equal(table['0'][2], '2017-05-19 14:42:49:362');
      assert.equal(table['0'][3], 'debug');
      return cb();
    });
  }
};