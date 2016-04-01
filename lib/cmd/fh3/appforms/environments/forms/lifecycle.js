/* globals i18n */
module.exports = {
  'desc': i18n._('Get Deployment Information For All Forms And Environments'),
  'examples': [{
    cmd: 'fhc appforms environments lifecycle',
    desc: i18n._('Get Deployment Information For All Forms And Environments')
  }],
  'demand': [],
  'alias': {},
  'describe': {},
  'url': "/api/v2/mbaas/appforms/lifecycle",
  'method': 'get'
};
