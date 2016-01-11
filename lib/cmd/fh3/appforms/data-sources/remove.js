module.exports = {
  'desc': 'Remove a single data source.',
  'examples': [{cmd: 'fhc appforms data-sources remove --id=<ID Of Data Source To Remove>', desc: 'Remove a single data source.'}],
  'demand': ['id'],
  'alias': {},
  'describe': {
    'id': "ID of the data source to remove"
  },
  'url': function (params) {
    return "/api/v2/appforms/data_sources/" + params.id;
  },
  'method': 'delete'
};
