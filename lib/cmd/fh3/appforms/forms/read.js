/* globals i18n */
module.exports = {
  'desc': i18n._('Read A Single Form.'),
  'examples': [{cmd: 'fhc appforms forms read --id=<ID Of Form To Read>', desc: i18n._('Read A Single Form')}],
  'demand': ['id'],
  'alias': {},
  'describe': {
    'id': i18n._("ID Of Form To Read")
  },
  'url': function (params) {
    return "/api/v2/appforms/forms/" + params.id;
  },
  'method': 'get'
};
