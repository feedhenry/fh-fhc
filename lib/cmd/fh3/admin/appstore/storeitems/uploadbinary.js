/* globals i18n */

var fhreq = require("../../../../../utils/request");

module.exports = {
  'desc' : i18n._('Upload binary for store item into AppStore'),
  'examples' : [{
    cmd : 'fhc admin appstore storeitems uploadbinary --id=<id> --type=<iphone|android|ipad> --binary=<binary>',
    desc : i18n._('Upload <binary> for store item with <id> into AppStore')
  }],
  'demand' : ['id','type','binary'],
  'alias' : {
    'id' : 'i',
    'type' : 't',
    'binary' : 'b',
    0 :'id',
    1 :'type',
    2 :'binary'
  },
  'describe' : {
    'id' : i18n._("Unique 24 character GUID of the store item."),
    'type' : i18n._("Type/platform of the binary"),
    'binary' : i18n._("Binary which will be updload.")
  },
  'customCmd': function(params, cb) {
    params.type = params.type.toLowerCase();
    if (params.type !== 'iphone' && params.type !== 'android' && params.type !== 'ipad') {
      return cb(i18n._("Invalid type informed :") + params.type);
    }
    fhreq.uploadFile("/box/srv/1.1/admin/storeitem/uploadbinary", params.binary, {"type":params.type,"guid":params.id},  "application/octet-stream", cb);
  }
};
