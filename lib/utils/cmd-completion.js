var _ = require('underscore');
var tabtab = require('tabtab');
var fhc = require("../fhc");

/**
 * Command completion module for fhc
 * See tabtab documentation for more information
 */
var completion = {
  setup: function () {
    tabtab.complete('fhc', function (err, data) {
      if (err || !data) {
        return;
      }
      var cmdList = _.filter(_.keys(fhc), function (key) {
        return key[0] !== '_';
      });
      tabtab.log(cmdList, data);
    });
  }
};

//TODO add completion support for commands with object format (FH3).

module.exports = completion;