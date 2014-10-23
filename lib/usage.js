var _ = require('underscore');

var usage = function(cmds){
  var cmdKeys = _.keys(cmds),
  msgs = [cmds._groupName + ' usage:'];
  for (var i=0; i<cmdKeys.length; i++){
    var key = cmdKeys[i],
    curCmd = cmds[key];
    if (key === '_groupName'){
      continue;
    }
    if (curCmd.usage){
      msgs.push("\t" + key + " : " + curCmd.usage)
    }else{
      // recurse
      msgs.push(curCmd._groupName);
      msgs.push(usage(curCmd));
    }
  }
  return msgs.join('\n');
};

module.exports = usage;
