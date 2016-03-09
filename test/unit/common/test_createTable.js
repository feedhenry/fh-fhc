var assert = require('assert');
var common = require('common');
var environments = require('test/fixtures/admin/environments');

module.exports = {
  'test createTableForEnvironments': function (done) {
    var table = common.createTableForEnvironments(environments);
    assert.equal(environments.length, table.length);

    // autoDeployOnCreate
    assert.equal(table['0'][2], false);
    assert.equal(table['1'][2], true);

    // autoDeployOnUpdate
    assert.equal(table['0'][3], false);
    assert.equal(table['1'][3], true);
    return done();
  }
};