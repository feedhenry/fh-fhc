/* globals i18n */
module.exports = {
  'desc' : i18n._('Creates an MBaaS Target.'),
  'examples' :
    [{
      cmd : 'fhc admin mbaas create --id=<MBaaS id> --url=<MBaaS URL> --servicekey=<MBaaS Service Key> --username=<MBaaS User Name> --password=<MBaaS Password> --type=feedhenry --decoupled=<bool> --size=<MBaaS Size> --label=<MBaaS label> --editable=<bool>',
      desc : 'Creates FeedHenry MBaaS Target'
    },
    {
      cmd : 'fhc admin mbaas create --id=<MBaaS id> --url=<OpenShift Master URL> --routerDNSUrl=<OpenShift Router DNS> --servicekey=<MBaaS Service Key> --fhMbaasHost=<MBaaS URL> --type=openshift3 --label=<MBaaS label> --editable=<bool>',
      desc : 'Creates OpenShift 3 MBaaS Target'
    }],
  'demand' : ['id', 'url', 'servicekey', 'username', 'password'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('Some unique identifier for your MBaaS'),
    'url' : i18n._('The hostname where your MBaaS exists'),
    'servicekey' : i18n._('Service key to authenticate the MBaaS'),
    'username' : i18n._('[FeedHenry] MBaaS Username'),
    'password' : i18n._('[FeedHenry] MBaaS Password'),
    'routerDNSUrl' : i18n._('[OpenShift 3] The wildcard DNS entry for your OpenShift Router'),
    'fhMbaasHost' : i18n._('[OpenShift 3] Exposed route where fh-mbaas is running in OpenShift 3'),
    'type' : i18n._('The type of MBaaS Target (feedhenry/openshift3)'),
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
