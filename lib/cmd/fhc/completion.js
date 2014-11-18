
module.exports = completion;

completion.desc = "Tab Completion for FHC";
completion.usage = "fhc completion >> ~/.bashrc\n"
                 + "fhc completion >> ~/.zshrc\n"
                 + "source <(fhc completion)";

function completion (argv, cb) {
  var tabtab = require('tabtab');
  return tabtab.complete('fhc', function(err, data) {    
    return cb(null, '');
  });
  
}
