/* globals i18n */
module.exports = {
  'desc' : i18n._('Get a new bearer token for an mbaas'),
  'examples' : [{ cmd : 'fhc admin mbaas bearertoken --username=<user@host.tld>, --password<userpassword> --url=<openshiftURL> --mbaasid=<mbaasid>', desc : i18n._('Gets a new bearer token')}],
  'demand' : ['username', 'password', 'url', 'mbaasid'],
  'alias' : {},
  'describe' : {
    'url' : i18n._('The host where your MBaaS exists'),
    'username' : i18n._('MBaaS username'),
    'password' : i18n._('MBaaS password'),
    'mbaasid': i18n._('The id for the MBaaS')
  },
  'url' : function(argv) {
    return '/api/v2/mbaases/' + argv.mbaasid + '/regenerate_keys';
  },
  'method' : 'post',
  'preCmd' : function(params, cb) {
    params._id = params.id;
    delete params.id;
    delete params._;
    delete params.$0;
    return cb(null, params);
  }
};
