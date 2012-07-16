
module.exports = prompt;

var log = require("./log");
var buffer = "";
var tty = require("tty");

process.stdin.setRawMode = process.stdin.setRawMode || tty.setRawMode;

function prompt (p, def, silent, cb) {
  if (!cb) cb = silent, silent = false;
  if (!cb) cb = def, def = undefined;
  if (def) p += "("+(silent ? "<hidden>" : def)+") ";
  var r = (silent ? silentRead : read).bind(null, def, cb);
  if (!process.stdout.write(p)) process.stdout.on("drain", function D () {
    process.stdout.removeListener("drain", D);
    r();
  });
  else r();
};

function read (def, cb) {
  var stdin = process.openStdin()
    , val = "";
  stdin.resume();
  stdin.setEncoding("utf8");
  stdin.on("error", cb);
  stdin.on("data", function D (chunk) {
    val += buffer + chunk;
    buffer = "";
    val = val.replace(/\r/g, '');
    if (val.indexOf("\n") !== -1) {
      if (val !== "\n") val = val.replace(/^\n+/, "");
      buffer = val.substr(val.indexOf("\n"));
      val = val.substr(0, val.indexOf("\n"));
      stdin.pause();
      stdin.removeListener("data", D);
      stdin.removeListener("error", cb);
      val = val.trim() || def;
      cb(null, val);
    }
  });
};

function silentRead (def, cb) {
  var stdin = process.openStdin();
  var val = "";
  process.stdin.setRawMode(true);
  stdin.resume();
  stdin.on("error", cb);
  stdin.on("data", function D (c) {
    c = "" + c;
    switch (c) {
      case "\n": case "\r": case "\r\n": case "\u0004":
        process.stdin.setRawMode(false);
        stdin.removeListener("data", D);
        stdin.removeListener("error", cb);
        val = val.trim() || def;
        process.stdout.write("\n");
        stdin.pause();
        return cb(null, val);
      case "\u0003": case "\0":
        return cb("cancelled");
        break;
      default:
        val += buffer + c;
        buffer = "";
        break;
    }
  });
};
