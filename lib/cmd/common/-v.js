var fhc = require('../../fhc');

module.exports = {
  'desc': 'Version info about ththis tool',
  'examples': [{
    cmd: 'fhc -v',
    desc: ''
  }],
  'demand': [],
  'alias': {},
  'describe': {},
  customCmd: function(params, cb) {
    var fhcVersionString = "FHC Version: " + fhc._version + '\n';
    return cb(null, fhcVersionString);
  }
};