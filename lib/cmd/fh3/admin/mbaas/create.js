/* globals i18n */
module.exports = {
  'desc' : i18n._('Creates an MBaaS.'),
  'examples' : [{ cmd : 'fhc admin mbaas create --id=<MBaaS id> --url=<MBaaS URL> --servicekey=<MBaaS Service Key> --username=<MBaaS User Name> --password=<MBaaS Password> --decoupled=<bool> --size=<MBaaS Size> --label=<MBaaS label> --editable=<bool>', desc : 'Creates an mbaas'}],
  'demand' : ['id', 'url', 'servicekey', 'username', 'password'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('Some unique identifier for your MBaaS'),
    'url' : i18n._('The hostname where your MBaaS exists'),
    'servicekey' : i18n._('Service key to authenticate the MBaaS'),
    'username' : i18n._('MBaaS Username'),
    'password' : i18n._('MBaaS Password'),
    'decoupled': i18n._('flag them mbaas as decoupled'),
    'size': i18n._('The size of the MBaaS'),
    'label': i18n._('A label to apply to the MBaaS, defaults to id if not specified'),
    'editable': i18n._('Determines if the MBaaS target is editable for non-reseller users')
  },
  'url' : '/api/v2/mbaases',
  'method' : 'post',
  'preCmd' : function(params, cb) {
    params._id = params.id;
    if (!params.label) {
      params.label = params.id;
    }
    delete params.id;
    delete params._;
    delete params.$0;
    return cb(null, params);
  }
};
