//tests for native command
var assert = require('assert');
var fhc = require("lib/fhc.js");

var nat = require('cmd/common/native.js');

var conf = require("cmd/fhc/fhcfg.js");
var apps = require("cmd/common/apps.js");
var request = require('lib/utils/request.js');
var mockrequest = require("lib/utils/mockrequest.js");
var ini = require('lib/utils/ini.js');

var testguid = "c0TPJtvFbztuS2p7NhZN3oZz";
var platform = process.platform;
var writeDir = (platform === "linux")?"/home/"+process.env.USER : (platform === "darwin")?"/Users/"+process.env.USER+"/Downloads":"C:\Download";
request.requestFunc = mockrequest.mockRequest;
module.exports = {
  "test native":function (cb){
    if(ini.get("feedhenry") === undefined)ini.set("feedhenry","https://apps.feedhenry.com");
    nat({ _ : ["config=apple","app="+testguid]},function (err, data){
      assert.equal(err,null);
      assert.equal(data.substr(0,5), "<?xml");
      return cb();
    });
  },
  "test native file write":function (cb) {
    //endure we have a domain to read against
    if(ini.get("feedhenry") === undefined)ini.set("feedhenry","https://apps.feedhenry.com");
    nat({ _ : ["config=apple","app="+testguid,"dir="+writeDir]},function (err, data){
      assert.equal(err,null);
      assert.equal(data.substr(0,21), "native config written");
      return cb();
    });
  },

  "test no fail when write fails":function (cb){    
    nat({ _ : ["config=apple","app="+testguid,"dir=somedir"]},function (err, data){
      assert.equal(err,null);
      //should still write out the contents to the terminal
      assert.ok(data);
      return cb();
    });
  }
};
