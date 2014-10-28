var base = require('./_baseCommand.js')('stage'),
ini = require('../../../utils/ini.js');
base.desc = "Stages a cloud application."
base.url = function(argv){
  var domain = ini.get("domain", "user"),
  url = '/embed/' + domain + '/' + argv.env +'/' + argv.app,
  query = [];
  if (argv.runtime){
    query.push('runtime=' + argv.runtime);
  }
  if (argv.clean){
    query.push('clean=' + argv.clean);
  }
  if (query.length > 0){
    url += '?' + query.join('&');
  }
  return url;
}
base.describe.r = "The Node.js runtime of your application, e.g. node06 or node08 or node010";
base.describe.c = "Do a full, clean stage. Cleans out all old application log files, removes cached node modules and does an 'npm install' from scratch";
base.alias.r = "runtime";
base.alias.c = "clean";

module.exports = base;
