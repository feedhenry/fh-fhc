var assert = require('assert');
var genericCommand = require('genericCommand');
var _ = require('underscore');
require('test/fixtures/admin/fixture_artifacts');
var artifacts = genericCommand(require('cmd/fh3/artifacts'));

module.exports = {
  'test artifacts app': function(cb) {
    artifacts({app:'1a'}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'android');
      assert.equal(table['0'][1], '3');
      assert.equal(table['0'][2], '2017-05-19 14:42:49:362');
      assert.equal(table['0'][3], 'debug');
      assert.equal(table['0'][4], 'https://support.us.feedhenry.com/digman/android-v3/dist/7143a3f0-3609-468e-ba1e-9c59abb0e8f6/android~4.0~3~CordovaApp.apk?digger=diggers.sam1-farm2-linux1');
      return cb();
    });
  }
};