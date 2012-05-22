module.exports = get;
get.usage = "fhc get <key> <value> (See `fhc fhcfg`)";
var fhc = require("./fhc");

function get (args, cb) {
  fhc.commands.fhcfg(["get"].concat(args), cb);
}
