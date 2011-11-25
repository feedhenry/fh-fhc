
// centralized stdout writer.

exports.doColor = doColor;
exports.write = write;

var fhc = require("../fhc.js");
var streams = {};
var ttys = {};
var net = require("net");
var sys = require("./sys");
var tty = require("tty");

function doColor (stream) {
  var conf = fhc.config.get("color");
  return (!conf) ? false
       : (conf === "always") ? true
       : isatty(stream);
}
function isatty (stream) {
if (!tty.isatty) return true;
  if (!stream) return false;
  if (stream.isTTY) return true;
  if (stream && (typeof stream.fd === "number")) {
    stream.isTTY = tty.isatty(stream.fd);
  }
  return stream.isTTY;
};

function write (args, stream, lf, cb) {
  if (typeof cb !== "function" && typeof lf === "function") {
    cb = lf;
    lf = null;
  }
  if (typeof cb !== "function" && typeof stream === "function") {
    cb = stream;
    stream = fhc.config.get("outfd");
  }

  stream = getStream(stream);
  if (lf == null) lf = isatty(stream);
  if (!stream) return cb && cb(), false;
  var isArray = Array.isArray(args);
  if (!isArray) args = [args];

  var msg = ""
    , colored = doColor(stream)
    , sep = isArray ? ',\n' : ' ';
  msg =  args.map(function (arg) {
    if (typeof arg !== "string") {
      if(fhc.config.get('usesysinspect'))
        return sys.inspect(arg, false, 5, colored) + "\n";
      else
        return JSON.stringify(arg, null, fhc.config.get('jsondepth'));
    } else {
      if (!colored) arg = arg.replace(/\033\[[0-9;]*m/g, '');
      return arg;
    }
  }).join(sep);
  if (isArray) msg = "[" + msg + "]";

  // listen to the "output" event to cancel/modify/redirect
  fhc.output = {stream:stream, message:msg};
  fhc.emit("output", fhc.output);
  if (!fhc.output) return cb && cb(), false; // cancelled
  stream = fhc.output.stream;
  msg = fhc.output.message;

  // use the \r\n in case we're in raw mode.
  msg = msg.split(/\r?\n/).concat("").join(lf ? "\r\n" : "\n");
  // output to stderr should be synchronous
  if (stream === process.stderr ||stream.fd === 2) {
    process.stderr.write(msg);
    if (cb) cb();
    return true;
  }
  var flushed = stream.write(msg);
  if (flushed && cb) {
    process.nextTick(cb);
  } else {
    stream.on("drain", cb);
  }
  return flushed;
}

function getStream (fd) {
  var stream;
  if (!fd && fd !== 0) return
  if (typeof fd === "string") fd = +fd;
  if (fd && typeof fd === "object") {
    stream = fd;
    fd = fd.fd;
  } else if (streams[fd]) {
    stream = streams[fd];
  } else try {
    stream = new net.Stream(fd);
  } catch (ex) {}
  if (!stream || !stream.writable) return;
  return streams[fd] = stream;
}
