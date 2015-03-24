var nock = require('nock');
var cloudReplies = {
  headers : { 'Content-Type': 'application/json' },
  hosts : function(){
    return {
      "hosts": {
        "development-name": "ngui-demo-1a",
        // of course this would never match a dyno's config, but for the sake of tests it'll do fine!
        "development-url": "https://apps.feedhenry.com",
        "live-name": "ngui-demo-1a",
        "live-url": "https://apps-live.feedhenry.com"
      },
      "status": "ok"
    };
  }
};

module.exports = function(n){
  return nock('https://apps.feedhenry.com')
  .filteringRequestBody(function(path) {
    return '*';
  })
  .post('/box/srv/1.1/ide/apps/app/hosts', '*')
  .times(n)
  .reply(200, cloudReplies.hosts, cloudReplies.headers);
};
