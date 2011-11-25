
module.exports = help;

var fs = require("fs")
  , path = require("path")
  , exec = require("./utils/exec")
  , fhc = require("./fhc")
  , output = require("./utils/output");

function help (args, cb) {  
  var section = args.shift();
  if (section === "help") {
    section = !fhc.config.get("usage") && "fhc";
  }
  if (section) {
    if ( fhc.config.get("usage")
      && fhc.commands[section]
      && fhc.commands[section].usage
    ) {
      fhc.config.set("loglevel", "silent");
      return output.write(fhc.commands[section].usage, cb);
    }
    var section_path = path.join(__dirname, "../man1/"+section+".1");
    return fs.stat
      ( section_path
      , function (e, o) {
          if (e) return cb(new Error("Help section not found: "+section));
          // function exec (cmd, args, env, takeOver, cb) {
          var manpath = path.join(__dirname, "..")
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
  } else getSections(function (er, sections) {
    if (er) return cb(er);
    fhc.config.set("loglevel", "silent");
    output.write
      ( ["FeedHenry CLI, the Command Line Interface to FeedHenry."
        , "\nUsage: fhc <command>"
        , ""
        , "where <command> is one of: "
        , " " + wrap(Object.keys(fhc.commands))
        , ""
        , "Add -h to any command for quick help, or for man pages, use fhc help <command>."
        , ""
        ].join("\n"), function () { cb(er); });
  });
};

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

function getSections(cb) {
  var ignoreSections = ['get', 'set', 'completion', 'init'];
  fs.readdir(path.join(__dirname, "../man1/"), function (er, files) {
    if (er) return cb(er);
    var sectionList = files.concat("help.1")
      .filter(function (s) { return s.match(/\.1$/); })
      .map(function (s) { return s.replace(/\.1$/, '');})
              .filter(function(s) { if(ignoreSections.indexOf(s) == -1) return s; });
              //              .filter(function(s) { console.log(ignoreSections.indexOf(s)); console.log(s); return s;})
    cb(undefined, sectionList);
  });
}

