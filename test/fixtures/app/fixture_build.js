var nock = require('nock');

function _cacheKeyUrl(n) {
  return '/box/srv/1.1/dat/log/read';
}

var buildReplies = {
  headers : { 'Content-Type': 'application/json' },
  deliver : function() {
    return { "cacheKey": "cachekeybeehatch" };
  },
  cacheKey : function() {
    return [{
      "action": {},
      "cacheKey": "cachekeybeehatch",
      "error": "",
      "log": ["Copy application files..."],
      "status": "pending"
    }];
  },
  cacheKeyBuildSuccess : function() {
    return [{"action":{"ota_url":"https://ota.com/android.zip","url":"https://apk.com/android.apk"},"cacheKey":"cachekeybeehatch","error":"","log":["Build complete"],"status":"complete"}];
  }
};

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
.post('/box/srv/1.1/wid/apps/android/1a2b3c4d5e6f7g8e9f0a1b2d/deliver', '*')
.reply(200, buildReplies.deliver, buildReplies.headers)
.get(_cacheKeyUrl(0)).query(true)
.reply(200, buildReplies.cacheKeyBuildSuccess, buildReplies.headers);
