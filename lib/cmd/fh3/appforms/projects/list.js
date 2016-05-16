/* globals i18n */
module.exports = {
  'desc': i18n._('Lists All Forms Projects'),
  'examples': [{cmd: 'fhc appforms projects list', desc: i18n._('Lists All Forms Projects')}],
  'demand': [],
  'alias': {},
  'describe': {},
  'url': "/api/v2/appforms/apps",
  'method': 'get'
};
