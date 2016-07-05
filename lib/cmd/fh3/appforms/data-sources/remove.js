/* globals i18n */
module.exports = {
  'desc': i18n._('Remove a single data source.'),
  'examples': [{cmd: 'fhc appforms data-sources remove --id=<ID Of Data Source To Remove>', desc: i18n._('Remove a single data source.')}],
  'demand': ['id'],
  'alias': {},
  'describe': {
    'id': i18n._("ID of the data source to remove")
  },
  'url': function (params) {
    return "/api/v2/appforms/data_sources/" + params.id;
  },
  'method': 'delete'
};
