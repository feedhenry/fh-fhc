var _ = require('underscore');
const COMMAND_WIDTH = 18;

var usage = function(cmds, includeDesc){
  var cmdKeys = _.keys(cmds),
  msgs = [],
  includeDesc = includeDesc || true;
  
  for (var i=0; i<cmdKeys.length; i++){
    var key = cmdKeys[i],
    curCmd = cmds[key],
    cmdUsage = curCmd.usage,
    cmdDesc = curCmd.desc;
    
    if (key === '_groupName'){
      continue;
    }
    
    // even out the key string's width
    while (key.length <= COMMAND_WIDTH){
      key += ' ';
    }
    
    if (cmdUsage){
      var msg = "  " + key
      msg = (includeDesc) ? msg  + "\t" + curCmd.desc : msg;
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
