module.exports = status;

status.desc = "Manage status";
status.usage = "fhc admin status \n fhc admin status <component> \n";

var common = require("../../../common");
var fhreq = require("../../../utils/request");
var ini = require('../../../utils/ini');
var _ = require('underscore');

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + status.usage);
}

function status(argv, cb) {
  var args = argv._;
  if (args.length === 1){
    switch (args[0].toLocaleLowerCase()){
      case "millicore":
        return millicoreStatus(cb);
    }
  }

}


function millicoreStatus(cb){
  fhreq.GET(fhreq.getFeedHenryUrl(),"/box/api/status","error getting status", function (err, ok){
    cb(err, ok);
  });
}
