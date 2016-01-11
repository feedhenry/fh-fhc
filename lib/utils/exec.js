module.exports = exec;
exec.spawn = spawn;
exec.pipe = pipe;

var log = require("./log");
var child_process = require("child_process");
var sys = require("./sys");
var fhc = require("../fhc");
var myUID = process.getuid ? process.getuid() : null;
var myGID = process.getgid ? process.getgid() : null;
var isRoot = process.getuid && myUID === 0;
var constants = require("constants");

// TODO Validate depreciated node API. Replace by using external module.

function exec(cmd, args, env, takeOver, cwd, uid, gid, cb) {
  if (typeof cb !== "function") {
    cb = gid;
    gid = null;
  }
  if (typeof cb !== "function") {
    cb = uid;
    uid = null;
  }
  if (typeof cb !== "function") {
    cb = cwd;
    cwd = null;
  }
  if (typeof cb !== "function") {
    cb = takeOver;
    takeOver = true;
  }
  if (typeof cb !== "function") {
    cb = env;
    env = process.env;
  }
  gid = gid === null ? myGID : gid;
  uid = uid === null ? myUID : uid;
  if (!isRoot) {
    if (fhc.config.get("unsafe-perm")) {
      uid = myUID;
      gid = myGID;
    } else if (uid !== myUID || gid !== myGID) {
      var e = new Error("EPERM: setuid() operation not permitted");
      e.errno = constants.EPERM;
      return cb(e);
    }
  }
  if (uid !== myUID) {
    log.verbose(uid, "Setting uid from " + myUID);
    log.verbose(new Error().stack, "stack at uid setting");
  }
  log.silly(cmd + " " + args.map(JSON.stringify).join(" "), "exec");
  var stdout = "";
  var stderr = "";
  var cp = spawn(cmd, args, env, takeOver, cwd, uid, gid);
  if (cp.stdout) {
    cp.stdout.on("data", function (chunk) {
      if (chunk) stdout += chunk;
    });
  }
  if (cp.stderr) {
    cp.stderr.on("data", function (chunk) {
      if (chunk) stderr += chunk;
    });
  }
  cp.on("exit", function (code) {
    var er = null;
    if (code) er = new Error("`" + cmd
      + (args.length ? " "
      + args.map(JSON.stringify).join(" ")
        : "")
      + "` failed with " + code)
    cb(er, code, stdout, stderr);
  });
  return cp;
}

function logger(d) {
  if (d) process.stderr.write(d + "");
}
function pipe(cp1, cp2, cb) {
  sys.pump(cp1.stdout, cp2.stdin);
  var errState = null
    , buff1 = ""
    , buff2 = "";
  if (log.level <= log.LEVEL.silly) {
    cp1.stderr.on("data", logger);
    cp2.stderr.on("data", logger);
  } else {
    cp1.stderr.on("data", function (d) {
      buff1 += d
    });
    cp2.stderr.on("data", function (d) {
      buff2 += d
    });
  }

  cp1.on("exit", function (code) {
    if (!code) return log.verbose(cp1.name || "<unknown>", "success");
    if (!cp2._exited) cp2.kill();
    log.error(buff1, cp1.name || "<unknown>");
    cb(errState = new Error(
      "Failed " + (cp1.name || "<unknown>") + "\nexited with " + code));
  });

  cp2.on("exit", function (code) {
    cp2._exited = true;
    if (errState) return;
    if (!code) return log.verbose(cp2.name || "<unknown>", "success", cb);
    log.error(buff2, cp2.name || "<unknown>");
    cb(new Error("Failed " + (cp2.name || "<unknown>") + "\nexited with " + code));
  });
}

function spawn(c, a, env, takeOver, cwd, uid, gid) {
  var fds = [0
    , 1
    , 2];
  var opts = {
    customFds: takeOver ? fds : [-1, -1, -1],
    env: env || process.env,
    cwd: cwd || null
  };
  var cp;
  if (uid !== null) opts.uid = uid;
  if (gid !== null) opts.gid = gid;
  if (!isNaN(opts.uid)) opts.uid = +opts.uid;
  if (!isNaN(opts.gid)) opts.gid = +opts.gid;
  cp = child_process.spawn(c, a, opts);
  cp.name = c + " " + a.map(JSON.stringify).join(" ");
  return cp;
}
