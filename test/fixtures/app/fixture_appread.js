var nock = require('nock');
var headers = { 'Content-Type': 'application/json' };

module.exports = function(n){
  return nock('https://apps.feedhenry.com')
  .filteringRequestBody(function() {
    return '*';
  })
  .post('/box/srv/1.1/ide/apps/app/read', '*')
  .times(n)
  .reply(200, function(){
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
  }, headers);
};
