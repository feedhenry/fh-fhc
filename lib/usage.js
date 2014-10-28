var _ = require('underscore');

var usage = function(cmds, includeDesc){
  var cmdKeys = _.keys(cmds),
  msgs = [],
  includeDesc = includeDesc || true;
  for (var i=0; i<cmdKeys.length; i++){
    var key = cmdKeys[i],
    curCmd = cmds[key];
    
    // new style commands do this
    if (curCmd.cmd){
      curCmd = curCmd.cmd;
    }
    if (key === '_groupName'){
      continue;
    }
    if (curCmd.usage){
      var msg = "  " + key
      msg = (includeDesc && curCmd.desc) ? msg  + " \t " + curCmd.desc : msg;
      msgs.push(msg)
    }else if (typeof curCmd === 'object'){
      // recurse
      msgs.push('  ' + curCmd._groupName);
      var recurseResult = usage(curCmd, includeDesc).split('\n');
      recurseResult = _.map(recurseResult, function(rR){
        return '  ' + rR;
      })
      msgs.push(recurseResult.join('\n'));
    }
  }
  return msgs.join('\n');
};

module.exports = usage;
