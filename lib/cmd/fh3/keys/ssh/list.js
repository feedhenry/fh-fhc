/* globals i18n */
var common = require('../../../../common.js');
var _ = require('underscore');
var fhc = require("../../../../fhc");

module.exports = {
  'desc' : i18n._('List SSH Keys'),
  'examples' :
    [{
      cmd : 'fhc keys ssh list',
      desc : i18n._("List of all SSH keys of the logged in user")
    }],
  'demand' : [],
  'alias' : {
    'json': 'j'
  },
  'describe' : {
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    fhc.user({json:true}, function(err, data) {
      var values = chopTheMiddleOfEachKeyValue(data);
      var headers = ['Name', 'Key'];
      var fields = ['name', 'key'];
      if (!params.json) {
        params._table = common.createTableFromArray(headers, fields, values);
        return cb(null,params);
      }
      return cb(null,values);
    });
  }
};

/**
 * when showing a table of keys, chop the middle out of each key (and replace with '...') for readability
 * @param data
 */
function chopTheMiddleOfEachKeyValue(data) {
  var values = _.map(data.keys, function(k) {
    return {name: k.name, key: k.key.replace(/(^.{25})(.*?)(.{20}$)/g, "$1.....$3")};
  });
  return values;
}