var base = require('./_baseCloudRequest')('act');
base.usage = "Performs an act request on a cloud app.";
base.describe.fn = 'Cloud function name to call';
base.demand.push('fn');
base.examples = [
  { cmd : 'fhc app act --app=1a2b3c --fn=<serverside Function> --data=<data to send> --env=<environment>', desc : 'Performs an act request on app with id 1a2b3c'}
];

module.exports = base;
