var _ = require('underscore');

var usage = function(cmds){
  var cmdKeys = _.keys(cmds),
  msgs = [cmds._groupName + ' usage:'];
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
      msgs.push("\t" + key + " : " + curCmd.usage)
    }else if (typeof curCmd === 'object'){
      // recurse
      msgs.push(curCmd._groupName);
      var recurseResult = usage(curCmd).split('\n');
      recurseResult = _.map(recurseResult, function(rR){
        return '\t' + rR;
      })
      msgs.push(recurseResult.join('\n'));
    }
  }
  return msgs.join('\n');
};

module.exports = usage;
