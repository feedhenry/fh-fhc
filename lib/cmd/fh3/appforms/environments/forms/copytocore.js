/* globals i18n */
module.exports = {
  'desc': i18n._('Copy A Form Definition From An Environment To Master Copy.'),
  'examples': [{
    cmd: 'fhc appforms environments forms copy_to_core --id=<ID Of Form To Copy Back> --environment=<ID Of Environment To Copy Form From>',
    desc: i18n._('Copy A Form Definition From An Environment To Master Copy.')
  }],
  'demand': ['environment', 'id'],
  'alias': {},
  'describe': {
    'id': i18n._("ID Of Form To Update"),
    'environment': i18n._("ID Of Environment To Copy Form From")
  },
  'url': function (params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/forms/" + params.id + "/copy_to_core";
  },
  'method': 'post'
};
