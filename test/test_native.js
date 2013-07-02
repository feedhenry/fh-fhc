//tests for native command
var assert = require('assert');
var fhc = require("../lib/fhc.js");

var nat = require('../lib/nativecfg.js');

var conf = require("../lib/fhcfg.js");
var apps = require("../lib/apps.js");
var request = require('../lib/utils/request.js');
var mockrequest = require("../lib/utils/mockrequest.js");
var ini = require('../lib/utils/ini.js');

var testguid = "c0TPJtvFbztuS2p7NhZN3oZz";
var platform = process.platform;
var writeDir = (platform === "linux")?"/home/"+process.env.USER : (platform === "darwin")?"/Users/"+process.env.USER+"/Downloads":"C:\Download";
console.log("writeDir = " + writeDir);
module.exports = {

    "test native":function (){
        fhc.load(function (er){
            request.requestFunc = mockrequest.mockRequest;
            if(ini.get("feedhenry") === undefined)ini.set("feedhenry","https://apps.feedhenry.com");
            nat(["config=apple","app="+testguid],function (err, data){
                console.log(err);
                    assert.equal(err,null);
                    assert.equal(data.substr(0,5), "<?xml");
            });
        });
    },

    "test native file write":function () {
        fhc.load(function (er){
            //endure we have a domain to read against
            if(ini.get("feedhenry") === undefined)ini.set("feedhenry","https://apps.feedhenry.com");
            nat(["config=apple","app="+testguid,"dir="+writeDir],function (err, data){
                console.log(data);
                assert.equal(err,null);
                assert.equal(data.substr(0,21), "native config written");
            });
        });
    },

    "test no fail when write fails":function (){
        fhc.load(function (er){
            nat(["config=apple","app="+testguid,"dir=somedir"],function (err, data){
                assert.equal(err,null);
                //should still write out the contents to the terminal
                assert.isNotNull(data);
            });
        });
    }

};