var nock = require('nock');
var headers = { 'Content-Type': 'application/json' };

module.exports = function(n){
  return nock('https://apps.feedhenry.com')
  .filteringRequestBody(function() {
    return '*';
  })
  .post('/box/srv/1.1/ide/apps/app/list', '*')
  .times(n)
  .reply(200, function(){
    return {
      "status": "ok",
      "list": [
        {
            "config": {
                "preview": {
                    "device": "generic"
                }
            },
            "description": "A tabbed application which displays news feeds",
            "id": "pviryBwt22iZ0iInufMYBuVV",
            "modified": "2011-07-28 13:27:30",
            "title": "tempApp",
            "version": 0,
            "width": 320
        }, {
            "config": {
                "nodejs": {
                    "enabled": "true"
                },
                "preview": {
                    "device": "iphone_3"
                }
            },
            "description": "First App",
            "id": "ZYeFBUOfKr7peAtIvTHY4R0F",
            "modified": "2011-07-28 14:34:12",
            "title": "Test",
            "version": 92,
            "width": 320
        }, {
            "config": {
                "nodejs.enabled": "true"
            },
            "description": "test123",
            "id": "rDfYZe-Lz5RGTRQQsIV9ovFn",
            "modified": "2011-07-27 12:14:02",
            "title": "test123",
            "version": 21,
            "width": 200
        }
      ],
      "nodejs": { "enabled": "true"},
      "preview": {"device": "iphone_3"}
    };
  }, headers);
}
