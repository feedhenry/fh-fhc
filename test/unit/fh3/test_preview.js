var assert = require('assert');
var genericCommand = require('genericCommand');
var _ = require('underscore');
var showPreviewCmd = genericCommand(require('cmd/fh3/preview/show'));
var urlPreviewCmd = genericCommand(require('cmd/fh3/preview/url'));

module.exports = {
  'test fhc preview show --app': function(cb) {
    showPreviewCmd({app:'wvnhw74db6nlhhm4kqo57jtl'}, function(err, data) {
      assert.ok(!err, "No Error is Expected");
      assert.ok(data, "Data is Expected");
      assert.equal(data.url, "https://support.us.feedhenry.com/box/srv/1.1/wid/support/studio/wvnhw74db6nlhhm4kqo57jtl/container");
      return cb();
    });
  },
  'test fhc preview url --app': function(cb) {
    urlPreviewCmd({app:'1a', json:true}, function(err, data) {
      assert.ok(!err, "No Error is Expected");
      assert.ok(data, "Data is Expected");
      assert.equal(data.url, "https://support.us.feedhenry.com/box/srv/1.1/wid/support/studio/1a/container");
      return cb();
    });
  }
};