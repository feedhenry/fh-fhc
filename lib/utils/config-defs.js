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
};

nopt.invalidHandler = function (k, val, type, data) {
  log.warn(k + "=" + JSON.stringify(val), "invalid config");
};

if (!stableFamily || (+stableFamily[2] % 2)) stableFamily = null;
else stableFamily = stableFamily[1] + "." + stableFamily[2];

var defaults;
Object.defineProperty(exports, "defaults", {get: function () {
  if (defaults) return defaults;
  return defaults =
    { argv : []
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
    , browser : process.platform === "darwin" ? "open" : "chromium-browser"
    , color : true
    , cookie: ""
    , cftarget: ""   // CloudFoundry settings..
    , cfuser: ""
    , cfpwd: ""
    , fhcluster: ""
    , editor : process.env.EDITOR || "vi"
    , global : false
    , globalconfig : path.resolve(process.execPath, "..", "..", "etc", "fhcrc")
    , jsondepth: 2
    , logfd : 2
    , loglevel : "warn"
    , filter : undefined
    , outfd : 1
    , parseable : false
    , prefix : path.join(process.execPath, "..", "..")
    , proxy : process.env.HTTP_PROXY || process.env.http_proxy || null
    , feedhenry : "https://apps.feedhenry.com/"
    , messaging : "" 
    , nodejs : true
    , dynofarm : "" 
    , nocache : false
    , live : undefined
    , table : true
    , thcolor : "green"
    , json : false
    , tar : process.env.TAR || "tar"
    , tmp : (process.env.TMPDIR || "/tmp")
    , usage : false
    , user : "nobody"
    , usesysinspect : false
    , username : ""
    , userconfig : path.resolve( process.env.HOME
                          , process.platform === "win32"
                            ? "fhc-config" : ".fhcrc")
    , usertargets : path.resolve( process.env.HOME
                          , process.platform === "win32"
                            ? "fhc-targets" : ".fhctargets")

    , version : false
    , viewer: "man"
    , _exit : true
    };
}});

exports.types = {
    argv : NaN
  , bindist : [String, null]
  , browser : String
  , color : ["always", Boolean]
  , cookie : String
  , cftarget : String
  , cfuser : String
  , cfpwd : String
  , fhcluster : String
  , editor : path
  , global : Boolean
  , globalconfig : path
  , jsondepth : Number
  , logfd : [Number, Stream]
  , loglevel : ["silent","win","error","warn","info","verbose","silly"]
  , filter : String
  , nodejs : Boolean
  , outfd : [Number, Stream]
  , parseable : Boolean
  , prefix: path
  , proxy : url
  , feedhenry : url
  , live : String
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
