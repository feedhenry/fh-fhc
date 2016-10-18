/* globals i18n */
module.exports = {
  'desc' : i18n._('Creates an MBaaS Target.'),
  'examples' :
    [{
      cmd : 'fhc admin mbaas create --id=<MBaaS id> --url=<MBaaS URL> --servicekey=<MBaaS Service Key> --username=<MBaaS User Name> --password=<MBaaS Password> --type=feedhenry --decoupled=<bool> --size=<MBaaS Size> --label=<MBaaS label>',
      desc : 'Creates FeedHenry MBaaS Target'
    },
    {
      cmd : 'fhc admin mbaas create --id=<MBaaS id> --url=<OpenShift Master URL> --routerDNSUrl=<OpenShift Router DNS> --servicekey=<MBaaS Service Key> --fhMbaasHost=<MBaaS URL> --type=openshift3 --label=<MBaaS label>',
      desc : 'Creates OpenShift 3 MBaaS Target'
    }],
  'demand' : ['id', 'url', 'servicekey', 'type'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('Some unique identifier for your MBaaS'),
    'url' : i18n._('[FeedHenry] The hostname where your MBaaS exists / [OpenShift 3] URL where the OpenShift Master(s) API is available (e.g. https://master.openshift.example.com:8443)'),
    'servicekey' : i18n._('Service key to authenticate the MBaaS'),
    'username' : i18n._('[FeedHenry] MBaaS Username'),
    'password' : i18n._('[FeedHenry] MBaaS Password'),
    'routerDNSUrl' : i18n._('[OpenShift 3] The wildcard DNS entry for your OpenShift Router (e.g. *.cloudapps.example.com)'),
    'fhMbaasHost' : i18n._('[OpenShift 3] Exposed route where fh-mbaas is running in OpenShift 3 (e.g. https://my-mbaas.openshift.example.com)'),
    'type' : i18n._('The type of MBaaS Target (feedhenry/openshift3)'),
    'decoupled': i18n._('flag them mbaas as decoupled'),
    'size': i18n._('The size of the MBaaS'),
    'label': i18n._('A label to apply to the MBaaS, defaults to id if not specified')
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
