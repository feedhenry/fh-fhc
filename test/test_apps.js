var assert = require('assert');
var fhc = require("fhc.js");
var util = require('util');
var apps = require('apps.js');
var target = require('target.js');
var set = require('set.js');
var logs = require('logs.js');
var read = require('read.js');
var deletes = require('delete.js');
var create = require('create.js');
var fhcfg = require('fhcfg.js');
var request = require('utils/request.js');
var mockrequest = require('utils/mockrequest.js');

module.exports = {

    'test apps': function() {      
      fhc.load(function (err) {
        set(["feedhenry", "https://apps.feedhenry.com"], function(err){

        request.requestFunc = mockrequest.mockRequest;

        // test apps list
        apps([], function (err, data) {
          assert.equal(err, null);
          assert.notEqual(data.list.length, 0);
        });
        // test read
        read(['0123'], function (err, data) {
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
        // test delete
        deletes(['0123'], function (err, data) {
          assert.equal(err, null);
          assert.equal(data[0].status, 'ok');
        });
        // test delete (multiple)
        deletes(['0123', '456', '789'], function (err, data) {
          assert.equal(err, null);
          assert.equal(data[0].status, 'ok');
        });
        // test create
        create(['foo1'], function (err, data) {
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
        // test logs
        logs(['get', '01234567890123456789012340'], function (err, data) {
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
      });
      });
    }
};



