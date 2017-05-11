var undeploy = require('cmd/fh3/app/undeploy.js');
var assert = require('assert');
var url = require('url');

module.exports = {
  'test app undeploy command happy path': function(done) {
    var params = {
      env: "dev",
      domain: "testing",
      id: "j7hslnrb257zkr4qzjndoqkl"
    };

    undeploy.preCmd(params, function(err, parsed) {
      // If embed flag is not set we must send false
      assert.equal(err, null);
      assert.equal(parsed.embed, false);

      var queryUrl = undeploy.url(parsed);
      var urlParts = url.parse(queryUrl);

      // Make sure that the URL is parseable
      assert.equal(typeof urlParts.pathname, 'string');

      // Make sure it calls the `deleteapp` endpoint
      assert.equal(urlParts.pathname.indexOf('api/v2/mbaas/deleteapp'), 0);
      assert.equal(urlParts.pathname.indexOf(params.domain) > 0, true);

      done();
    });
  },

  'test app undeploy command with embed flag set': function(done) {
    var params = {
      env: "dev",
      domain: "testing",
      embed: '',
      id: "j7hslnrb257zkr4qzjndoqkl"
    };

    undeploy.preCmd(params, function(err, parsed) {
      assert.equal(err, null);
      // If embed flag is not set we must send false
      assert.equal(parsed.embed, true);
      done();
    });
  }
};