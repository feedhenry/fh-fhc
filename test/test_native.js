//tests for native command
var assert = require('assert');
var fhc = require("../lib/fhc.js");
var native = require('../lib/native');
var conf = require("../lib/fhcfg.js");
var apps = require("../lib/apps.js");
var request = require('../lib/utils/request.js');
var mockrequest = require("../lib/utils/mockrequest.js");
var ini = require('../lib/utils/ini.js');

var testguid = "c0TPJtvFbztuS2p7NhZN3oZz";
var platform = process.platform;
var writeDir = (platform === "linux")?"/home/Downloads":(platform === "darwin")?"/Users/"+process.env.USER+"/Downloads":"C:\Download";
console.log(writeDir);
module.exports = {

    "test native":function (){
        fhc.load(function (er){
            request.requestFunc = mockrequest.mockRequest;
            if(ini.get("feedhenry") === undefined)ini.set("feedhenry","https://apps.feedhenry.com");
            native(["confg=apple","app=c0TPJtvFbztuS2p7NhZN3oZz"],function (err, data){
                    assert.equal(err,null);
                    assert.equal(data.substr(0,5), "<?xml");
            });
        });
    },

    "test native file write":function () {
        fhc.load(function (er){
            //endure we have a domain to read against
            if(ini.get("feedhenry") === undefined)ini.set("feedhenry","https://apps.feedhenry.com");
            native(["config=apple","app=c0TPJtvFbztuS2p7NhZN3oZz","dir="+writeDir],function (err, data){
                console.log(data);
                assert.equal(err,null);
                assert.equal(data.substr(0,21), "native config written");
            });
        });
    },

    "test no fail when write fails":function (){
        fhc.load(function (er){
            native(["config=apple","app=c0TPJtvFbztuS2p7NhZN3oZz","dir=somedir"],function (err, data){
                assert.equal(err,null);
                //should still write out the contents to the terminal
                assert.isNotNull(data);
            });
        });
    }

};