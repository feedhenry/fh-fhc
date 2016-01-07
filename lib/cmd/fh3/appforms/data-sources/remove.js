module.exports = {
  'desc': 'Remove A Single Data Source.',
  'examples': [{cmd: 'fhc appforms data-sources remove --id=<ID Of Data Source To Remove>', desc: 'Remove A Single Data Source'}],
  'demand': ['id'],
  'alias': {},
  'describe': {
    'id': "ID Of The Data Source To Remove"
  },
  'url': function (params) {
    return "/api/v2/appforms/data_sources/" + params.id;
  },
  'method': 'delete'
};
