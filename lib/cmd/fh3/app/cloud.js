var base = require('./_baseCloudRequest')('cloud');
base.usage = "Performs a cloud request on a cloud app";
base.examples = [
  { cmd : 'fhc app cloud --app=1a2b3c --path=<serverside path from root> --data=<Data to send> --env=<environment>', desc : 'Performs a cloud request on app with id 1a2b3c'}
];
module.exports = base;
