var fhc = require('../../fhc');
var usage = require('../../usage');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var exec = require('../../utils/exec')

module.exports = { 
  'desc' : 'Help with the FeedHenry Command',
  'examples' : [
    { cmd : 'fhc help', desc : 'Retrieves help for all of FHC'},
    { cmd : 'fhc help app', desc : 'Retrieves help with the app command'}
  ],
  'demand' : [],
  'alias' : {},
  globalFlags : {
    '--json' : { desc : 'Forces the return of JSON output even if config is set otherwise - useful in scripts', usage : '--json' },
    '--table' : { desc : 'Forces the return of table output even if config is set otherwise', usage : '--table' }
  },
  'customCmd' : function(argv, cb){
    var command = argv._,
    cmdFn = fhc,
    cmds = [],
    isNGUI = fhc.config.get('fhversion') >= 3,
    cmd;
    
    if (!command || command.length === 0){
      return this.fhcUsage(cb);
    }
    
    // Find the fhc command from the tree
    cmdFn = fhc;
    while (cmd = argv._.shift()){  
      cmds.push(cmd);
      cmdFn = cmdFn[cmd];  
    }
    
    // Objects only appear when it's a command group
    if (typeof cmdFn === 'object' && argv._ && argv._.length === 0){  
      return this.commandGroupUsage(cmds, cmdFn, cb);
    }
    
    if ( fhc.config.get("usage") && cmdFn.usage){
      return this.singleCommandUsage(cmdFn, cb);
    }
    
    // TODO Needs to show move info here:
    return this.singleCommandManPage(cmds, cmdFn, cb);
  },
  fhcUsage : function(cb){
    var commands = fhc._tree,
    v = fhc.config.get('fhversion') || 3,
    mergedCommands = {};
    _.extend(mergedCommands, commands.common, commands['fh' + v]);
    
    //console.log(require('util').inspect(mergedCommands, false, 1, false));
    mergedCommands._groupName = 'fhc';
    
    var commandsList = usage(mergedCommands),
    usageList = usage(commands.fhc);
    
    var msg = ["FeedHenry CLI, the Command Line Interface to FeedHenry."];
    msg.push("\nUsage: fhc <command>")
    msg.push("");
    msg.push("where <command> is one of: ");
    msg.push(commandsList)
    msg.push("\nor an FHC command: ");
    msg.push(usageList);
    msg.push('', this._globalFlags());
    msg.push("\nAdd -h to any command for quick help, or for man pages, use fhc help <command>.");
    return cb(null, msg.join('\n'));
  },
  commandGroupUsage : function(cmds, cmdFn, cb){
    var msg = [];
    msg.push('fhc ' + cmds.join(' ') + ' <action>');
    msg.push('Where <action> is one of:');
    msg.push(usage(cmdFn));
    return cb(null, msg.join('\n'));
  },
  singleCommandUsage : function(cmdFn, cb){
    var usage = cmdFn.usage_ngui || cmdFn.usage || 'No usage for this command found';
    return cb(null, usage);
  },
  singleCommandManPage : function(cmds, cmdFn, cb){
    var self = this,
    section = cmds[cmds.length-1],
    section_path;
    section_path = path.join(__dirname, "../../../man1/");
    section_path = path.join.apply(this, [section_path].concat(cmds));
    section_path += '.1';
    
    return fs.stat(section_path, function (err, out) {
      if (err){
        // Try at least to return something useful
        self.singleCommandUsage(cmdFn, function(err, usageInfo){
          return cb(new Error("Help section not found : "+section + '\n' + usageInfo));  
        });
      } 
      var manpath = path.join(__dirname, "..", "..", ".."), 
      env = _.clone(process.env);
      env.MANPATH = manpath;
      exec("man", [section], env, true, function(err, data){
       return cb(err);
     });
    });
  },
  _globalFlags : function(){
    var msg = [];
    msg.push('Global Options')
    msg.push(usage(this.globalFlags));
    return msg.join('\n');
  }
};
