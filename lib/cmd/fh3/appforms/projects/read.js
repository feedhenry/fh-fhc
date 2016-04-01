/* globals i18n */
module.exports = {
  'desc': i18n._('Read A Single Form Project'),
  'examples': [{
    cmd: 'fhc appforms projects read --id=<ID Of Form Project To Read>',
    desc: i18n._('Read A Single Form Project')
  }],
  'demand': ['id'],
  'alias': {},
  'describe': {
    'id': i18n._("GUID Of Form Project To Read")
  },
  'url': function (params) {
    return "/api/v2/appforms/apps/" + params.id;
  },
  'method': 'get'
};
