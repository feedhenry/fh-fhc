
module.exports = set;
set.usage = "fhc set <key> <value> (See `fhc fhcfg`)";
var fhc = require("./fhc");

function set (args, cb) {
  fhc.commands.fhcfg(["set"].concat(args), cb);
}
