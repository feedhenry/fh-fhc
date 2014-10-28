
module.exports = help;

var fs = require("fs");
var path = require("path");
var exec = require("../../utils/exec");
var fhc = require("../../fhc");
var output = require("../../utils/output");
var util = require("util");
var usage = require('../../usage.js');

function help (argv, cb) {
  var args = argv._;
  var section = args.shift();
  if (section === "help") {
    section = !fhc.config.get("usage") && "fhc";
  }
  if (section) {
    if ( fhc.config.get("usage")
      && fhc[section]
      && fhc[section].usage
    ) {
      fhc.config.set("loglevel", "silent");
      var isNGUI = fhc.config.get('fhversion') >= 3;  
      // error purposely ignored for --help
      if (isNGUI && fhc[section].usage_ngui) return output.write(fhc[section].usage_ngui, cb);
      else return output.write(fhc[section].usage, cb);
    }
    var section_path = path.join(__dirname, "../../../man1/"+section+".1");
    return fs.stat
      ( section_path
      , function (e, o) {
          if (e) return cb(new Error("Help section not found: "+section));
          // function exec (cmd, args, env, takeOver, cb) {
          var manpath = path.join(__dirname, "..", "..", "..")
            , env = {};
          Object.keys(process.env).forEach(function (i) { env[i] = process.env[i]; });
          env.MANPATH = manpath;
          var viewer = fhc.config.get("viewer");
          switch (viewer) {
            case "woman":
              var args = ["-e", "(woman-find-file \"" + section_path + "\")"];
              exec("emacsclient", args, env, true, cb);
              break;
            default:
              exec("man", [section], env, true, function(err, data){
               return cb(err);
            });
          }
        }
      );
  } else {
    fhc.config.set("loglevel", "silent");
    output.write
      ( ["FeedHenry CLI, the Command Line Interface to FeedHenry."
        , "\nUsage: fhc <command>"
        , ""
        , "where <command> is one of: "
        , fhc.cmdList
        , "\nor an FHC command: "
        , fhc.fhcList
        , "\nAdd -h to any command for quick help, or for man pages, use fhc help <command>."
        , ""
        ].join("\n"), function () {
          return cb();
        });
  }
}

function wrap (arr) {
  var out = ['']
    , l = 0;
  arr.sort(function (a,b) { return a<b?-1:1; })
    .forEach(function (c) {
      if (out[l].length + c.length + 2 < 60) {
        out[l] += ', '+c;
      } else {
        out[l++] += ',';
        out[l] = c;
      }
    });
  return out.join("\n ").substr(2);
}
