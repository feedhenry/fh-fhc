module.exports = {
  'desc': 'Creates an environments.',
  'examples': [{
    cmd: 'fhc admin-environment-aliases create --environment=<environment id> --environmentAlias=<environment id alias> --environmentLabelAlias=<environment label alias>',
    desc: 'Creates an environment alias'
  }],
  'demand': ['environment', 'environmentAlias', 'environmentLabelAlias'],
  'alias': {},
  'describe': {
    'environment': 'The name for your environment this alias is targeting',
    'environmentAlias': 'An aliased name for your environment',
    'environmentLabelAlias': 'Description of your environment alias'
  },
  'url': '/api/v2/environmentaliases',
  'method': 'post',
  'preCmd': function (params, cb) {
    return cb(null, {
      environmentIdAlias: params.environmentAlias,
      environmentId: params.environment,
      environmentLabelAlias: params.environmentLabelAlias
    });
  }
};
