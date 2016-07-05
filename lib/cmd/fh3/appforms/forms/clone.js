/* globals i18n */
module.exports = {
  'desc': i18n._('Clones An Existing Form'),
  'examples': [{cmd: 'fhc appforms forms clone --id=<ID Of Form To Clone>', desc: i18n._('Clones An Existing Form')}],
  'demand': ['id'],
  'alias': {},
  'describe': {
    'id': i18n._('ID Of Form To Clone')
  },
  'url': function (params) {
    return '/api/v2/appforms/forms/' + params.id + "/clone";
  },
  'method': 'post'
};
