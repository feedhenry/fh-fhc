var assert = require('assert');
var fhc = require("../lib/fhc.js");
var act = require('../lib/act.js');
var request = require('../lib/utils/request.js');
var mockrequest = require('../lib/utils/mockrequest.js');

module.exports = {

    'test act functions': function() {
      fhc.load(function (er){
        console.log("In test act");
        request.requestFunc = mockrequest.mockRequest;

        act(['0123', 'getCloudData','{\"name\":\"bono\"}'], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        }); 
      });
    }
};
