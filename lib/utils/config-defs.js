// defaults, types, and shorthands.

var path = require("path");
var url = require("url");
var Stream = require("stream").Stream;
var semver = require("semver");
var stableFamily = semver.parse(process.version);
var os = require("os");
var nopt = require("nopt");
var log = require("./log");

nopt.typeDefs.semver = { type: semver, validate: validateSemver };

function validateSemver (data, k, val) {
  if (!semver.valid(val)) return false;
  data[k] = semver.valid(val);
}

nopt.invalidHandler = function (k, val) {
  log.warn(k + "=" + JSON.stringify(val), "invalid config");
};

if (!stableFamily || (+stableFamily[2] % 2)) stableFamily = null;
else stableFamily = stableFamily[1] + "." + stableFamily[2];

var defaults;
Object.defineProperty(exports, "defaults", {get: function () {
  if (defaults) return defaults;
  defaults =
    { argv : []
    , bare : ''
    , bindist : stableFamily
        && ( stableFamily + "-"
           + "ares" + process.versions.ares + "-"
           + "ev" + process.versions.ev + "-"
           + "openssl" + process.versions.openssl + "-"
           + "v8" + process.versions.v8 + "-"
           + process.platform + "-"
           + (process.arch ? process.arch + "-" : "")
           + os.release() )

      // are there others?
    , browser : process.platform === "darwin" ? "open" : "google-chrome"
    , clean : false
    , color : true
    , cookie: ""
    , cftarget: ""   // CloudFoundry settings..
    , cfuser: ""
    , cfpwd: ""
    , explain: 0 // FH Explain output level. 0=none, 1=active 2=active stacktrace
    , stack: false
    , fhcluster: ""
    , editor : process.env.EDITOR || "vi"
    , global : false
    , globalconfig : path.resolve(process.execPath, "..", "..", "etc", "fhcrc")
    , jsondepth: 2
    , logfd : 2
    , loglevel : "warn"
    , filter : undefined
    , inmemoryconfig: false
    , outfd : 1
    , parseable : false
    , persistTargets : true
    , prefix : path.join(process.execPath, "..", "..")
    , proxy : process.env.HTTP_PROXY || process.env.http_proxy || null
    , feedhenry : null
    , messaging : ""
    , nodejs : true
    , dynofarm : ""
    , nocache : false
    , live : undefined
    , registry: ""
    , table : true
    , thcolor : "green"
    , json : false
    , statsMode : false
    , tar : process.env.TAR || "tar"
    , tmp : (process.env.TMPDIR || "/tmp")
    , usage : false
    , user : "nobody"
    , usesysinspect : false
    , username : ""
    , userconfig : process.platform === "win32" ? path.resolve( process.env.USERPROFILE, "fhc-config" ) : path.resolve(process.env.HOME, ".fhcrc")
    , usertargets : process.platform === "win32" ?  path.resolve( process.env.USERPROFILE,"fhc-targets") : path.resolve(process.env.HOME, ".fhctargets")
    , version : false
    , viewer: "man"
    , _exit : true
    , dateformat : "DD MMM YYYY HH:mm:ss"
    };
  return defaults;
}});

exports.types = {
  argv : NaN
  , bare : String
  , bindist : [String, null]
  , browser : String
  , clean: Boolean
  , color : ["always", Boolean]
  , cookie : String
  , cftarget : String
  , cfuser : String
  , cfpwd : String
  , editor : path
  , explain : Number
  , stack : Boolean
  , inmemoryconfig: Boolean
  , global : Boolean
  , globalconfig : path
  , jsondepth : Number
  , logfd : [Number, Stream]
  , loglevel : ["silent","win","error","warn","info","verbose","silly"]
  , fhversion : Number
  , filter : String
  , nodejs : Boolean
  , outfd : [Number, Stream]
  , parseable : Boolean
  , persistTargets : Boolean
  , prefix: path
  , proxy : url
  , feedhenry : url
  , live : String
  , registry: String
  , statsMode : Boolean
  , table : Boolean
  , thcolor : String
  , json : Boolean
  , tar : String
  , tmp : path
  , "unsafe-perm" : Boolean
  , usage : Boolean
  , user : String
  , username : String
  , userconfig : path
  , usesysinspect : Boolean
  , version : Boolean
  , viewer: path
  , _exit : Boolean
};

exports.shorthands = {
  d : ["--loglevel", "info"]
  , dd : ["--loglevel", "verbose"]
  , ddd : ["--loglevel", "silly"]
  , silent : ["--loglevel", "silent"]
  , verbose : ["--loglevel", "verbose"]
  , silly : ["--loglevel", "silly"]
  , h : ["--usage"]
  , H : ["--usage"]
  , "?" : ["--usage"]
  , help : ["--usage"]
  , v : ["--version"]
};
