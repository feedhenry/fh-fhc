var assert = require('assert');
var genericCommand = require('genericCommand');
var nock = require('nock');

var configuration = {
  set: genericCommand(require('cmd/fh3/configuration/set')),
  list: genericCommand(require('cmd/fh3/configuration/list'))
};

var data = {
  "auto Rotate": "true",
  "flurry Application Key": "",
  "keyTest": "valueTest",
  "orientation": "portrait",
  "packages": "",
  "remote Debug": "true",
  "splash Image": "",
  "status": "ok",
  "tile Image": "",
  "undefined": "false",
  "version Name": "1.0"
};

module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/ide/apps/config/update')
  .reply(200, {
    "status": "ok"
  })
  .post('/box/srv/1.1/ide/apps/config/list')
  .times(2)
  .reply(200, data);

module.exports = {
  'test configuration list --app=<app> --destination=<destination>': function(cb) {
    configuration.list({app:"usqzucmg4uibvxknkete7smy", destination:"windowsphone7"}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc configuration list --app=<app> --destination=<destination> --property=<property> --value=<value>': function(cb) {
    configuration.list({app:"usqzucmg4uibvxknkete7smy", destination:"windowsphone7", property:"remote Debug", value:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status,"ok");
      return cb();
    });
  }
};