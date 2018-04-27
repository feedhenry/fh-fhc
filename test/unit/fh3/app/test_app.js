var assert = require('assert');
var genericCommand = require('genericCommand');

var app = {
  update: genericCommand(require('cmd/fh3/app/update')),
  updateConfig: genericCommand(require('cmd/fh3/app/updateConfig'))
};

var nock = require('nock');

module.exports = nock('https://apps.feedhenry.com')
  .get('/box/api/projects/qk4tdpaoy5st7oaj5wmiqvrj/apps/qk4tdpbpa56m53nsdq23xjji')
  .reply(200, {})
  .put('/box/api/projects/qk4tdpaoy5st7oaj5wmiqvrj/apps/qk4tdpbpa56m53nsdq23xjji')
  .reply(200, {})


module.exports = {
  'test fhc update  --project --app --title': function(cb) {
    app.update({project:'qk4tdpaoy5st7oaj5wmiqvrj', app:'qk4tdpbpa56m53nsdq23xjji', title:'title'}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  }
};