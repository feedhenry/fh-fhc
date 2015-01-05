
module.exports = completion;

completion.desc = "Tab Completion for FHC";
completion.usage = "fh completion >> ~/.bashrc\n"
                 + "fh completion >> ~/.zshrc\n"
                 + "source <(fh completion)";

function completion (argv, cb) {
  var tabtab = require('tabtab');
  return tabtab.complete('fhc', function(err, data) {    
    return cb(null, '');
  });
  
}
