var base = require('./_baseCloudCommand.js')('endpoints');
base.method = 'get';
base.desc = 'Provides the endpoints for the specified app in the specified environment.';
module.exports = base;
