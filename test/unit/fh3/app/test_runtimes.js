var runtimes = require('cmd/fh3/app/runtimes.js');
var assert = require('assert');
var url = require('url');

module.exports = {
  'test app runtimes command --id': function(done) {
    var params = {
      domain: "testing",
      id: "j7hslnrb257zkr4qzjndoqkl"
    };

    runtimes.preCmd(params, function(err, parsed) {
      assert.equal(err, null);

      var queryUrl = runtimes.url(parsed);
      var urlParts = url.parse(queryUrl);

      // Make sure that the URL is parseable
      assert.equal(typeof urlParts.pathname, 'string');

      done();
    });
  }
};