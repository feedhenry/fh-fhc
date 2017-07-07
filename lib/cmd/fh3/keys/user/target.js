/* globals i18n */
var fhc = require("../../../../fhc");
var USER_API_KEY = "user_api_key";
var targets = require('../../../fhc/targets');

module.exports = {
  'desc' : i18n._('Target a ssh user API Key'),
  'examples' :
    [{
      cmd : 'fhc keys user target --label=<label>',
      desc : i18n._("Target the API Key with the <lable>")
    }],
  'demand' : ['label'],
  'alias' : {
    'label': 'l',
    0 : 'label'
  },
  'describe' : {
    'label' : i18n._("Label of the API Key Management that you want to target.")
  },
  'customCmd': function(params, cb) {
    fhc.keys.user.read({label:params.label, json:true}, function(err, key) {
      if (err) {
        return cb(err);
      }
      fhc.config.set(USER_API_KEY, key.key);
      targets.save(key.key);
      return cb(null, key.key);
    });
  }
};