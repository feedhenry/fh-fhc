var assert = require('assert');
var genericCommand = require('genericCommand');
var command = genericCommand(require('cmd/fh3/auth'));

var nock = require('nock');
module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/admin/authpolicy/auth')
  .reply(200, {status:"ok"});

module.exports = {
  'test appinit --app --key': function(cb) {
    command({app:'xzauxfwgzpedqbcaxujffd6p',key:'934ba74c28076931633bbc41507462c6e9d85894'}, function(err,data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.equal(data.status, "ok");
      return cb();
    });
  }
};