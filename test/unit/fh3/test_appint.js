var assert = require('assert');
var genericCommand = require('genericCommand');
var command = genericCommand(require('cmd/fh3/appinit'));

var nock = require('nock');
module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/app/init')
  .reply(200, {
    "apptitle": "Sync App",
    "domain": "support",
    "firstTime": false,
    "hosts": {
      "environment": "dev",
      "type": "cloud_nodejs",
      "url": "https://support-xzauxfuns4fnjafvu23kwhpx-dev.mbaas1.us.feedhenry.com"
    },
    "init": {
      "trackId": "p7rzdgjh65kv5mlvl53fy2dd"
    },
    "status": "ok"
  });

module.exports = {
  'test appinit --app --key': function(cb) {
    command({app:'xzauxfwgzpedqbcaxujffd6p',key:'934ba74c28076931633bbc41507462c6e9d85894'}, function(err,data) {
      assert.equal(err, null);
      assert.ok(data);
      assert.equal(data.status,"ok");
      return cb();
    });
  }
};