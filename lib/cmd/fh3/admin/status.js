module.exports = status;

status.desc = "Manage status";
status.usage = "fhc admin status \n fhc admin status <component> \n";
status.perm = "cluster:read";

var fhreq = require("../../../utils/request");

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
