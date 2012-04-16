var assert = require('assert');
var fhc = require("fhc.js");
var keys = require("keys.js");
var request = require('utils/request.js');
var mockrequest = require('utils/mockrequest.js');

module.exports = {
  'list keys' : function(){
  	fhc.load(function(err){
  		request.requestFunc = mockrequest.mockRequest;
  		keys(['user', 'list'], function(err, list){
  		  assert.equal(err, null);
  		  assert.isNotNull(list);
  		  assert.equal(list.length == 1);
  		})
  	})
  }
}