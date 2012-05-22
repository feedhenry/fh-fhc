var output = require('utils/output.js');
var util = require('util');
var fhc = require('fhc.js');
var fhreq = require('utils/request.js');
var messaging = require('messaging.js');
var request = require('utils/request.js');
var assert = require('assert');
var mockrequest = require('utils/mockrequest.js');

function mockRequest2 (fhurl, method, where, what, etag, nofollow, cb_) {
  if (typeof cb_ !== "function") cb_ = nofollow, nofollow = false;
  if (typeof cb_ !== "function") cb_ = etag, etag = null;
  if (typeof cb_ !== "function") cb_ = what, what = null;
  var err = null, parsed, data, response;

  if (where == 'sys/info/ping') {
    data = mockMsgPing;                      
  }else if (where == 'sys/info/version') {
    data = mockMsgVersion;
  }else if (where == 'sys/info/stats'){
    data = mockMsgStats;
  }else if (where == 'msg'){
    data = mockMsgTopics;
  }else if (where == 'msg/profile'){
    data = mockMsgTopic;
  }else if (where == 'msg/profile'+'?'+'123'){
    data = mockMsgTopicQuery;
  }else {
    throw new Error('Unhandled endpoint! ' +  where);
  }
  return cb_(err, data,JSON.stringify(data), data);
};

module.exports = {

    'test messaging' : function() {
      fhc.load(function(er) {
        console.log("In test messaging");
        request.requestFunc = mockrequest.mockRequest;
        
        // test messaging ping 
        messaging(['ping'], function(err, data) {
          assert.equal(err, null);
          assert.equal(data, 'ok');
        });
        // test messaging version
        messaging(['version'], function(err, data) {
          assert.equal(err, null);
          assert.notEqual(data, null);
        });

        // test messaging stats
        messaging(['stats'], function(err, data) {
          assert.equal(err, null);
          assert.notEqual(data.length, 0);
        });

        // test messaging list topics
        messaging(["topics"], function(err, data) {
          assert.equal(err, null);
          assert.notEqual(data.length, 0);
        });

        // tests messaging topics
        messaging(['topic','profile'], function(err, data) {
          assert.equal(err, null);
          assert.notEqual(data.length, 0);
        });

        // tests messaging topics
        messaging(['topic', 'profile', '123'], function(err, data) {
          assert.equal(err, null);
          assert.notEqual(data.length, 0);
        });

      });
    }
};
