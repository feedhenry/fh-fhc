var nock = require('nock');
var assert = require('assert');

var cloudReplies = {
  headers : { 'Content-Type': 'application/json' },
  appRead : function(url, req){
    return {
      "app": {
        "guid": "1a",
        "config" : {
          "scm" : "scmconfig" 
        }
      },
      "inst": {
        "apiKey": "88ec2c02a9813135d73bf2ac0442761f540a606e",
        "nodejs": "true",
        "guid": "1a"
      },
      "status": "ok"
    };
  },
  hosts : function(){
    return {
      "hosts": {
        "development-name": "ngui-demo-1a",
        // of course this would never match a dyno's config, but for the sake of tests it'll do fine!
        "development-url": "https://apps.feedhenry.com", 
      },
      "status": "ok"
    };
  },
  act : function(){
    return { ok : true };
  }
};

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function(path) {
  return '*';
})
.post('/box/srv/1.1/ide/apps/app/read', '*')
.times(2)
.reply(200, cloudReplies.appRead, cloudReplies.headers)
.post('/box/srv/1.1/ide/apps/app/hosts', '*')
.times(2)
.reply(200, cloudReplies.hosts, cloudReplies.headers)
.post('/cloud/somefunc')
.reply(200, cloudReplies.act, cloudReplies.headers)
.post('/some/custom/cloud/host')
.reply(200, cloudReplies.act, cloudReplies.headers);
