/* globals i18n */
module.exports = {
  'desc' : i18n._('Update an MBaaS.'),
  'examples' : [{ cmd : 'fhc admin mbaas update --id=<MBaaS id> --url=<MBaaS URL> --servicekey=<MBaaS Service Key> --username=<MBaaS User Name> --password=<MBaaS Password> --decoupled=<bool> --size=<MBaaS Size> --label=<MBaaS label> --editable=<bool>', desc : 'Updates an mbaas with id <mbaasId>'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('Some unique MBaaS identifier'),
    'url' : i18n._('The hostname where your MBaaS exists'),
    'servicekey' : i18n._('Service key to authenticate the MBaaS'),
    'username' : i18n._('MBaaS Username'),
    'password' : i18n._('MBaaS Password'),
    'decoupled': i18n._('flag them mbaas as decoupled'),
    'size': i18n._('The size of the MBaaS'),
    'label': i18n._('A label to apply to the MBaaS'),
    'editable': i18n._('Determines if the MBaaS target is editable for non-reseller users')
  },
  'url' : function(params) {
    return '/api/v2/mbaases/' + params.id;
  },
  'method' : 'put',
  'preCmd' : function(params, cb) {
    delete params._;
    delete params.$0;
    return cb(null, params);
  }
};
