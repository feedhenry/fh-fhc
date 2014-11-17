var nock = require('nock');
var assert = require('assert');

var mockKeyList = function(){
  return   {
    "status" : "ok",
    "list" : [{
      "keyType" :"user",
      "keyReference" : "rDfYZYkRMYfEGaREzgm9Mu-5",
      "label" : "UserKey",
      "key" : "pviryBwt22iZ0iInufMYBuVV",
      "secret" : "pviryBwt22iZ0iInufMYBuVqw",
      "revoked" : null,
      "revokedBy" : null,
      "revokedEmail" : null
    }]
  };
}

var mockKeyCreate = function(){
  return {
    "status" : "ok",
    "apiKey" : {
      "keyType" :"user",
      "keyReference" : "rDfYZYkRMYfEGaREzgm9Mu-5",
      "label" : "UserKey",
      "key" : "pviryBwt22iZ0iInufMYBuVV",
      "secret" : "pviryBwt22iZ0iInufMYBuVqw",
      "revoked" : null,
      "revokedBy" : null,
      "revokedEmail" : null
    }
  };
}

var mockKeyRevoked = function(){
  return {
    "status" : "ok",
    "apiKey" : {
      "keyType" :"user",
      "keyReference" : "rDfYZYkRMYfEGaREzgm9Mu-5",
      "label" : "UserKey",
      "key" : "pviryBwt22iZ0iInufMYBuVV",
      "secret" : "pviryBwt22iZ0iInufMYBuVqw",
      "revoked" : 1334748847555,
      "revokedBy" : "rDfYZYkRMYfEGaREzgm9Mu-3",
      "revokedEmail" : "tester@example.com"
    }
  };
}

var mockKeyUpdated = function(){
  return {
    "status" : "ok",
    "apiKey" : {
      "keyType" :"user",
      "keyReference" : "rDfYZYkRMYfEGaREzgm9Mu-5",
      "label" : "UserKey-Updated",
      "key" : "pviryBwt22iZ0iInufMYBuVV",
      "secret" : "pviryBwt22iZ0iInufMYBuVqw",
      "revoked" : null,
      "revokedBy" : null,
      "revokedEmail" : null
    }
  };
};
var headers = { 'Content-Type': 'application/json' };



module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function(path) {
  return '*';
})
.post('/box/srv/1.1/ide/apps/api/list', '*')
.times(5)
.reply(200, mockKeyList, headers)
.post('/box/srv/1.1/ide/apps/api/create', '*')
.times(2)
.reply(200, mockKeyCreate, headers)
.post('/box/srv/1.1/ide/apps/api/delete', '*')
.reply(200, mockKeyRevoked, headers)
.post('/box/srv/1.1/ide/apps/api/update', '*')
.reply(200, mockKeyUpdated, headers);
