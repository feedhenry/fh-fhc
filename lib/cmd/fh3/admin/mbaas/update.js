/* globals i18n */
module.exports = {
  'desc' : i18n._('Update an MBaaS Target.'),
  'examples' :
    [{
      cmd : 'fhc admin mbaas update --id=<MBaaS id> --url=<MBaaS URL> --servicekey=<MBaaS Service Key> --username=<MBaaS User Name> --password=<MBaaS Password> --decoupled=<bool> --size=<MBaaS Size> --label=<MBaaS label>',
      desc : 'Updates FeedHenry MBaaS Target with id <mbaasId>'
    },
    {
      cmd : 'fhc admin mbaas update --id=<MBaaS id> --url=<OpenShift Master URL> --routerDNSUrl=<OpenShift Router DNS> --servicekey=<MBaaS Service Key> --fhMbaasHost=<MBaaS URL> --label=<MBaaS label>',
      desc : 'Updates OpenShift 3 MBaaS Target with id <mbaasId>'
    }],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('Some unique MBaaS identifier'),
    'url' : i18n._('[FeedHenry] The hostname where your MBaaS exists / [OpenShift 3] URL where the OpenShift Master(s) API is available (e.g. https://master.openshift.example.com:8443)'),
    'servicekey' : i18n._('Service key to authenticate the MBaaS'),
    'username' : i18n._('[FeedHenry] MBaaS Username'),
    'password' : i18n._('[FeedHenry] MBaaS Password'),
    'routerDNSUrl' : i18n._('[OpenShift 3] The wildcard DNS entry for your OpenShift Router (e.g. *.cloudapps.example.com)'),
    'fhMbaasHost' : i18n._('[OpenShift 3] Exposed route where fh-mbaas is running in OpenShift 3 (e.g. https://my-mbaas.openshift.example.com)'),
    'decoupled': i18n._('flag them mbaas as decoupled'),
    'size': i18n._('The size of the MBaaS'),
    'label': i18n._('A label to apply to the MBaaS')
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
