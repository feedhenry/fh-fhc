/* globals i18n */
var fhc = require("../../../../fhc");
var common = require("../../../../common");
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('Resources across FeedHenry'),
  'examples' :
  [{
    cmd : 'fhc resources cache set --env=<environment> --type=<type> --value=<value>',
    desc : i18n._('Set cache into the <environment> as <value> <type>')
  },
  {
    cmd : 'fhc resources cache set --type=size --value=524288000 --env=live',
    desc : i18n._('Set cache into the <live> as <524288000> <size>')
  },
  {
    cmd : 'fhc resources cache set --type=size --value=50 --env=live',
    desc : i18n._('Set resources cache into the <live> as <50> <percent>')
  }],
  'demand' : ['env','type','value'],
  'alias' : {
    'env':'e',
    'type':'t',
    'value':'v',
    0 : 'env',
    1 : 'type',
    2 : 'value'
  },
  'describe' : {
    'env' : i18n._('Environment ID which you want flush the cache'),
    'type' : i18n._("The type is percent or size"),
    'value' : i18n._("The value is the size into Bits or a percent of available into domain")
  },
  'customCmd' : function(params, cb) {
    if ( params.type !== 'percent' && params.type !== 'size') {
      return cb(null, i18n._("Invalid type!"));
    }
    common.doApiCall(fhreq.getFeedHenryUrl(),  "api/v2/resources/" + fhc.curTarget + "/" + params.env  + "/cache/set", {
      cache: {
        type: params.type,
        value: params.value
      }
    }, i18n._("Call failed: "), cb);
  }
};