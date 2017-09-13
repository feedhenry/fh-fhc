/* globals i18n */

var fhreq = require("../../../../../utils/request");

module.exports = {
  'desc' : i18n._('Upload icon for store item into AppStore'),
  'examples' : [{
    cmd : 'fhc admin appstore storeitems uploadicon --id=<id> --icon=<icon>',
    desc : i18n._('Upload icon <icon> for store item with <id> into AppStore')
  }],
  'demand' : ['id','icon'],
  'alias' : {
    'id' : 'i',
    'icon' : 'ic',
    0 :'id',
    1 :'icon'
  },
  'describe' : {
    'id' : i18n._("Unique 24 character GUID of the store item."),
    'icon' : i18n._("Icon which will be updload.")
  },
  'customCmd': function(params, cb) {
    fhreq.uploadFile("/box/srv/1.1/admin/storeitem/uploadbinary", params.icon, {"type":"icon", "guid":params.id}, "application/octet-stream" , cb);
  }
};
