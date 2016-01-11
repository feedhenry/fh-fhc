module.exports = {
  'desc': 'Promote A Form From One Environment To Another',
  'examples': [{
    cmd: 'fhc appforms environments forms promote --id=<ID Of Form To Promote> --from=<ID Of Environment To Promote From> --to=<ID Of Environment To Promote To>',
    desc: 'Promote A Form From One Environment To Another'
  }],
  'demand': ['from', 'to', 'id'],
  'alias': {},
  'describe': {
    'id': "ID Of Form To Promote",
    'from': "ID Of Environment To Promote Form From",
    'to': "ID Of Environment To Promote Form To"
  },
  'url': function (params) {
    return "/api/v2/mbaas/" + params.from + "/appforms/forms/" + params.id + "/promote/" + params.to;
  },
  'method': 'post'
};