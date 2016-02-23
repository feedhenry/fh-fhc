var base = require('./_baseDbRequest');
var list = base({ act : 'list' });
list.desc = 'Lists collections within an apps database';

list.examples = [
  { cmd : 'fhc app db list --app=2b --env=dev', desc : 'Lists all db collections in app 2b in env dev'},
];
module.exports = list;
