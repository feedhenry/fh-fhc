/* globals i18n */
module.exports = {
  'desc': i18n._('Deletes A Single Form. This will undeploy all forms from all environments.'),
  'examples': [{cmd: 'fhc appforms forms delete --id=<ID Of Form To Delete>', desc: i18n._('Deletes A Single Form.')}],
  'demand': ['id'],
  'alias': {},
  'describe': {
    'id': i18n._('ID Of The Form To Remove.')
  },
  'url': function (params) {
    return '/api/v2/appforms/forms/' + params.id;
  },
  'method': 'delete'
};
