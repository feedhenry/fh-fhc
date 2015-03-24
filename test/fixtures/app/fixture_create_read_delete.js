var nock = require('nock');
var appReplies = {
  headers : { 'Content-Type': 'application/json' },
  create : function(){
    return {
        "guid": "Ts0J1_NG799HL8ER4arN3LKZ",
        "status": "ok",
        "tasks": ["8dc3da1987bc66c8676ed51c21798479"],
        "_etag": "\"kP99hYXTFI6RIs5xpi2N2F\""
    };
  },
  read : function(){
    return {
        "app": {
          "config": {},
          "guid": "c0TPJzF6ztq0WjezxwPEC5W8",
          "type": "",
          "w3cid": "com.gmail.dberesford.cloned.app.anat"
        },
        "inst": {
          "config": {"preview": {"device": "iphone_3"}},
          "description": "This app demonstrates how to use client-side packages to customise application behavior and appearance. It is also the application that is used in the \"App Anatomy\" help document - http://docs.feedhenry.com/wiki/App_Anatomy  ",
          "guid": "c0TPJtvFbztuS2p7NhZN3oZz",
          "height": 480,
          "title": "Cloned App Anat",
          "width": 320,
          "nodejs" : true
        },
        "status": "ok",
        "_etag": "\"9MivSOQ-3BCUBr0X8hvZjk\""
    };
  },
  delete : function(){
    return {
        "inst": {
          "id": "vMjTeuszvyOKzfERgXlWc721",
          "title": "foo"
        },
        "status": "ok",
        "_etag": "\"fwY6WBcro_FalLPvn6sWB-\""
    };
  }
};

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function(path) {
  return '*';
})
.post('/box/srv/1.1/ide/apps/app/create', '*')
.reply(200, appReplies.create, appReplies.headers)
.post('/box/srv/1.1/ide/apps/app/delete', '*')
.times(4)
.reply(200, appReplies.delete, appReplies.headers)
.post('/box/srv/1.1/ide/apps/app/read', '*')
.reply(200, appReplies.read, appReplies.headers)
.get('/box/srv/1.1/dat/log/read?cacheKeys=[{%22cacheKey%22:%228dc3da1987bc66c8676ed51c21798479%22,%22start%22:0}]', '*')
.reply(200, function(){ return {}; }, appReplies.headers);
