var assert = require('assert');
var genericCommand = require('genericCommand');
var stageCommand = genericCommand(require('cmd/fh3/app/stage'));

module.exports = {
  'hapy test app stage deploy': function(cb) {
    stageCommand.preCmd({
      app: "j7hslnrb257zkr4qzjndoqkl",
      env: "dev",
    }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'hapy test app stage deploy clean as false': function(cb) {
    stageCommand.preCmd({
      app: "j7hslnrb257zkr4qzjndoqkl",
      env: "dev",
      clean:false
    }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'hapy test app stage deploy autodeploy as false': function(cb) {
    stageCommand.preCmd({
      app: "j7hslnrb257zkr4qzjndoqkl",
      env: "dev",
      autodeploy:false
    }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'hapy test app stage deploy gitRefType as tag': function(cb) {
    stageCommand.preCmd({
      app: "j7hslnrb257zkr4qzjndoqkl",
      env: "dev",
      gitRefType:"tag"
    }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'hapy test app stage deploy gitRefHash': function(cb) {
    stageCommand.preCmd({
      app: "j7hslnrb257zkr4qzjndoqkl",
      env: "dev",
      gitRefHash:"946267f9858332c3a9dc70bc4b32fc6e21839e57"
    }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'hapy test app stage deploy gitRefValue as master': function(cb) {
    stageCommand.preCmd({
      app: "j7hslnrb257zkr4qzjndoqkl",
      env: "dev",
      gitRefValue:"development"
    }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test app stage deploy gitRefType with invalid value': function(cb) {
    stageCommand.preCmd({
      app: "j7hslnrb257zkr4qzjndoqkl",
      env: "dev",
      gitRefType:"invalid"
    }, function(err) {
      assert.throws(
        function() {
          throw cb(i18n._('Invalid parameter for gitRefType :' + params.gitRefType));
        },
        Error
      );
      return cb();
    });
  },
  'test app stage deploy clean with invalid value': function(cb) {
    stageCommand.preCmd({
      app: "j7hslnrb257zkr4qzjndoqkl",
      env: "dev",
      clean:"invalid"
    }, function(err) {
      assert.throws(
        function() {
          throw cb(i18n._('Invalid param --clean value: ' + params.clean));
        },
        Error
      );
      return cb();
    });
  },
  'test app stage deploy autodeploy with invalid value': function(cb) {
    stageCommand.preCmd({
      app: "j7hslnrb257zkr4qzjndoqkl",
      env: "dev",
      autodeploy:"invalid"
    }, function(err) {
      assert.throws(
        function() {
          throw cb(i18n._('Invalid param --autodeploy value: ' + params.autodeploy));
        },
        Error
      );
      return cb();
    });
  }
};