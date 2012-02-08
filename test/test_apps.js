var assert = require('assert');
var fhc = require("fhc.js");
var util = require('util');
var apps = require('apps.js');
var target = require('target.js');
var set = require('set.js');
var logs = require('logs.js');
var fhcfg = require('fhcfg.js');
var request = require('utils/request.js');
var mockrequest = require('utils/mockrequest.js');

module.exports = {

    'test apps': function() {      
      fhc.load(function (err) {
        set(["feedhenry", "https://apps.feedhenry.com"], function(err){

        console.log("In test apps");
        request.requestFunc = mockrequest.mockRequest;

        // test apps list
        apps([], function (err, data) {
          assert.equal(err, null);
          assert.notEqual(data.list.length, 0);
        });
        // test apps read
        apps(['read','0123'], function (err, data) {
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
        // test apps delete
        apps(['delete','0123'], function (err, data) {
          assert.equal(err, null);
          assert.equal(data[0].status, 'ok');
        });
        // test apps delete (multiple)
        apps(['delete','0123', '456', '789'], function (err, data) {
          assert.equal(err, null);
          assert.equal(data[0].status, 'ok');
        });
        // test apps create
        apps(['create','foo1'], function (err, data) {
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
        // test logs
        logs(['show', '01234567890123456789012340'], function (err, data) {
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
      });
      });
    }
};



