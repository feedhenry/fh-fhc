var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/appforms/fixture_themes');
var appformsthemes = {
  create : genericCommand(require('cmd/fh3/appforms/themes/create')),
  read : genericCommand(require('cmd/fh3/appforms/themes/read')),
  update : genericCommand(require('cmd/fh3/appforms/themes/update')),
  delete : genericCommand(require('cmd/fh3/appforms/themes/delete')),
  list : genericCommand(require('cmd/fh3/appforms/themes/list')),
  clone: genericCommand(require('cmd/fh3/appforms/themes/clone'))
};
module.exports = {
  'test appforms-forms list': function(cb) {
    appformsthemes.list({}, function (err, data){
      assert.equal(err, null);
      assert.equal(data.length, 1);
      assert.equal(data[0]._id, 'somethemeid');
      return cb();
    });
  },
  'test appforms-forms read': function(cb) {
    appformsthemes.read({ id : 'somethemeid'}, function (err, data){
      assert.equal(err, null);
      assert.equal(data._id, 'somethemeid');
      return cb();
    });
  },
  'test appforms-forms create': function(cb) {
    appformsthemes.create({ themefile : "test/fixtures/appforms/fixture_form.json" }, function (err, data){
      assert.equal(err, null);
      assert.equal(data._id, 'somethemeid');
      return cb();
    });
  },
  'test appforms-forms update': function(cb) {
    appformsthemes.update({ id: 'somethemeid', themefile : "test/fixtures/appforms/fixture_form.json" }, function (err){
      assert.equal(err, null);
      return cb();
    });
  },
  'test appforms-forms delete': function(cb) {
    appformsthemes.delete({ id : 'somethemeid' }, function (err){
      assert.equal(err, null);
      return cb();
    });
  },
  'test appforms-forms clone': function(cb) {
    appformsthemes.clone({ id : 'somethemeid' }, function (err){
      assert.equal(err, null);
      return cb();
    });
  }
};