var base = require('./_baseDbRequest');
var importCmd = base({act : 'import'});
var fs = require('fs');
importCmd.desc = 'Imports data into an apps database from a zip file';
importCmd.demand.push('fileName');
importCmd.examples = [
  { cmd : 'fhc app db import --app=2b --env=dev --userKey=3a --appKey=4b --fileName=someZip.zip', desc : 'Imports all collections in someZip.zip into app with id 2b'},
];
importCmd.describe.fileName = "Zip archive containing JSON, BSON or CSV files which make up the collections. Filenames contained within the zip file will be imported collection names.";
importCmd.preCmd = function(params, cb){
  fs.readFile(params.fileName, function(err, fileBuffer){
    if (err){
      return cb(err);
    }
    params.file = fileBuffer;
    return cb(null, params);
  });
};
module.exports = importCmd;
