var assert = require('assert');
var genericCommand = require('genericCommand');

var session = {
  info: genericCommand(require('cmd/fh3/session/info')),
  verify: genericCommand(require('cmd/fh3/session/verify'))
};

var nock = require('nock');

module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/admin/authpolicy/sessioninfo')
  .reply(200, [])
  .post('/box/srv/1.1/admin/authpolicy/verifysession')
  .reply(200, [])

module.exports = {
  'test fhc session verify --sessionToken': function(cb) {
    session.verify({token:'token'}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc session verify --sessionToken': function(cb) {
    session.info({token:'token'}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  }
};