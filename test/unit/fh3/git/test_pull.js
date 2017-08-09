var assert = require('assert');
var genericCommand = require('genericCommand');
var pullCmd = genericCommand(require('cmd/fh3/git/pull'));

var nock = require('nock');

function _cacheKeyUrl(n) {
  return '/box/srv/1.1/dat/log/read';
}

var cacheReplies = {
  headers : { 'Content-Type': 'application/json' },
  deliver : function() {
    return { "cacheKey": "somechachekey" };
  },
  cacheKey : function() {
    return [{
      "action": {},
      "cacheKey": "somechachekey",
      "error": "",
      "log":  [ 'Cordova App Git pull finished sucessfully .' ],
      "status": "pending"
    }];
  },
  success : function() {
    return [{"action":{},"cacheKey":"somechachekey","error":"","log":['Cordova App Git pull finished sucessfully .'],"status":"complete"}];
  }
};

module.exports = nock('https://apps.feedhenry.com')
  .get(_cacheKeyUrl(0)).query(true)
  .times(3)
  .reply(200, cacheReplies.success, cacheReplies.headers)
  .post("/box/srv/1.1/ide/", "*/app/read")
  .times(3)
  .reply(200, { app:
  { config: {},
    frameworks: [ 'jQuery-1.3.2' ],
    guid: 'ip4a4ahrk6jxvtdmd5olxmm5',
    migrated: false,
    type: '',
    w3cid: 'com.redhat.cmacedo.helloword018233181497619061959' },
    inst:
    { apiKey: 'd1f6e307867bc6438896c3b945ede7da26ba0d3a',
      config:
      { autodeploy: [Object],
        gitref: [Object],
        initialisedFromTemplate: true,
        nodejs: [Object],
        notification_email: 'cmacedo@redhat.com',
        scm: [Object] },
      description: '',
      domain: 'support',
      email: 'cmacedo@redhat.com',
      guid: 'ip4a4aflpukhgfhb5om5nrny',
      height: 0,
      migrated: false,
      nodejs: 'true',
      title: 'Cloud App',
      width: 0 },
    status: 'ok' })
  .post("/box/api/projects/1a/apps/1a/pull")
  .times(2)
  .reply(200,{ cacheKeys:
    [ 'somechachekey' ] }
  )
  .post("/box/srv/1.1/pub/app/1a/refresh")
  .times(4)
  .reply(200, { cacheKey: 'somechachekey',
    fileKey: 'df8a50567f66cb19bc3a7153459b0448',
    status: 'ok' }
  );


module.exports = {
  'test fhc pullCmd --app': function(cb) {
    pullCmd({app:'1a'}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc pullCmd --app --clean': function(cb) {
    pullCmd({app:'1a',clean:true}, function(err, data) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc pullCmd --app --clean --json': function(cb) {
    pullCmd({app:'1a',clean:true,json:true}, function(err, data) {
      assert.equal(err, null);
      return cb();
    });
  }
};