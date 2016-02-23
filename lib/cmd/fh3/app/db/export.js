var base = require('./_baseDbRequest');
var exportCmd = base({act : 'export'});
var fs = require('fs');
exportCmd.desc = 'Exports collections within a database';
exportCmd.examples = [
  { cmd : 'fhc app db export --app=2b --env=dev --userKey=3a --appKey=4b', desc : 'Exports all db collections in app 2b in env dev'},
];
exportCmd.demand.push('format');
exportCmd.describe.format = "Format of the exported data - valid values are JSON, BSON and CSV";
exportCmd.describe.collection = "Collection to export";
var baseCustomCmd = exportCmd.customCmd;
exportCmd.customCmd = function(params, cb){
  baseCustomCmd(params, function(err, result){
    if (err){
      return cb(err);
    }
    var fileName = params.app + '-' + params.env;
    if (params.collection){
      fileName += "-" + params.collection;
    }
    fileName += ".zip";
    fs.writeFile('./' + fileName, result, function(err){
      if (err){
        return cb(err);
      }
      return cb(null, { message : 'Exported database to file ' + fileName, fileName : fileName });
    });
    
  });
};
module.exports = exportCmd;
