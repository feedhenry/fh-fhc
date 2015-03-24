var assert = require('assert');
var nockEnvironmentAliases = require('test/fixtures/admin/fixture_environment_aliases');
var genericCommand = require('genericCommand');
var adminenvironmentaliases = {
  create : genericCommand(require('cmd/fh3/admin/environments/alias/create')),
  read : genericCommand(require('cmd/fh3/admin/environments/alias/read')),
  update : genericCommand(require('cmd/fh3/admin/environments/alias/update')),
  delete : genericCommand(require('cmd/fh3/admin/environments/alias/delete')),
  list : genericCommand(require('cmd/fh3/admin/environments/alias/list'))
};

module.exports = {
  setUp : function(done){
    return done();
  },
  'test admin-environment-aliases list': function(done) {
    adminenvironmentaliases.list({_ : []}, function (err, data){
      assert.equal(err, null);
      assert.equal(data.length, 1);
      assert.equal(data[0].environmentId, 'dev');
      assert.equal(data[0].environmentIdAlias, 'myDev');
      return done();
    });
  },
  'test admin-environment-aliases read': function(done) {
    adminenvironmentaliases.read({ id : '1a'}, function (err, data){
      assert.equal(err, null);
      assert.equal(data.environmentId, 'dev');
      return done();
    });
  },
  'test admin-environment-aliases create': function(done) {
    adminenvironmentaliases.create({ environment : 'dev', environmentAlias : 'myDev', environmentLabelAlias : 'My Dev' }, function (err, data){
      assert.equal(err, null);
      assert.equal(data.environmentLabelAlias, 'My Dev');
      return done();
    });
  },
  'test admin-environment-aliases update': function(done) {
    adminenvironmentaliases.update( { id : '1a', environmentLabelAlias : 'My Dev 2'}, function (err, data){
      assert.equal(err, null);
      return done();
    });
  },
  'test admin-environment-aliases delete': function(done) {  
    adminenvironmentaliases.delete({id : '1a'}, function (err, data){
      assert.equal(err, null);
      return done();
    });
  },
  tearDown : function(done){
    nockEnvironmentAliases.done();
    return done();
  },
};
