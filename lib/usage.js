var _ = require('underscore');
const COMMAND_WIDTH = 18;
const spacer = '\t';

var _wrap = function(cmdDesc){
  var splitAt = process.stdout.columns - COMMAND_WIDTH - 6,
    spacerStr = new Array(COMMAND_WIDTH).join(' '); // Make a COMMAND_WIDTH sized string of spaces
  spacerStr += spacer;
  cmdDesc = cmdDesc.substr(0, splitAt) + spacerStr + cmdDesc.substr(splitAt);
  return cmdDesc;
};

var usage = function(cmds, includeDesc){
  var cmdKeys = _.keys(cmds),
    msgs = [];
  includeDesc = includeDesc || true;

  for (var i=0; i<cmdKeys.length; i++){
    var key = cmdKeys[i],
      curCmd = cmds[key],
      cmdUsage = curCmd.usage,
      cmdDesc = curCmd.desc;

    if (key === '_groupName'){
      continue;
    }

    // even out the key string's width. Right now, this only works for 1 level of wrap - nothing really wraps right now. no big deal.
    while (key.length <= COMMAND_WIDTH){
      key += ' ';
    }

    if (cmdDesc && cmdDesc.length > process.stdout.columns - COMMAND_WIDTH){
      cmdDesc = _wrap(cmdDesc);
    }

    if (cmdUsage){
      var msg = "  " + key;
      msg = (includeDesc) ? msg  + spacer + cmdDesc : msg;
      msgs.push(msg);
    }else if (typeof curCmd === 'object'){
      // recurse
      msgs.push('  ' + curCmd._groupName);
      var recurseResult = usage(curCmd, includeDesc).split('\n');
      recurseResult = _.map(recurseResult, function(rR){
        return '  ' + rR;
      });
      msgs.push(recurseResult.join('\n'));
    }
  }
  return msgs.join('\n');
};

module.exports = usage;
