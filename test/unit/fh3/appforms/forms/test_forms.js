var assert = require('assert');
var genericCommand = require('genericCommand');
var nockEnvironment = require('test/fixtures/appforms/fixture_forms');
var appformsforms = {
  create : genericCommand(require('cmd/fh3/appforms/forms/create')),
  read : genericCommand(require('cmd/fh3/appforms/forms/read')),
  update : genericCommand(require('cmd/fh3/appforms/forms/update')),
  delete : genericCommand(require('cmd/fh3/appforms/forms/delete')),
  list : genericCommand(require('cmd/fh3/appforms/forms/list')),
  clone: genericCommand(require('cmd/fh3/appforms/forms/clone'))
};
module.exports = {
  'test appforms-forms list': function(cb) {
    appformsforms.list({}, function (err, data){
      assert.equal(err, null);
      assert.equal(data.length, 1);
      assert.equal(data[0]._id, 'someformid');
      return cb();
    });
  },
  'test appforms-forms read': function(cb) {
    appformsforms.read({ id : 'someformid'}, function (err, data){
      assert.equal(err, null);
      assert.equal(data._id, 'someformid');
      return cb();
    });
  },
  'test appforms-forms create': function(cb) {
    appformsforms.create({ formfile : "test/fixtures/appforms/fixture_form.json" }, function (err, data){
      assert.equal(err, null);
      assert.equal(data._id, 'someformid');
      return cb();
    });
  },
  'test appforms-forms update': function(cb) {
    appformsforms.update({ id: 'someformid', formfile : "test/fixtures/appforms/fixture_form.json" }, function (err, data){
      assert.equal(err, null);
      return cb();
    });
  },
  'test appforms-forms delete': function(cb) {
    appformsforms.delete({ id : 'someformid' }, function (err, data){
      assert.equal(err, null);
      return cb();
    });
  },
  'test appforms-forms clone': function(cb) {
    appformsforms.clone({ id : 'someformid' }, function (err, data){
      assert.equal(err, null);
      return cb();
    });
  }
};