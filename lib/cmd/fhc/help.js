var fhc = require('../../fhc');
var usage = require('../../usage');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var argUtils = require('../../utils/args')
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
    
    if (!cmdFn){
      return cb('Error - command not found: ' + cmds.join(' '))
    }
    
    // Objects only appear when it's a command group
    if (typeof cmdFn === 'object' && argv._ && argv._.length === 0){  
      return this.commandGroupUsage(cmds, cmdFn, cb);
    }
    
    if ( fhc.config.get("usage") && cmdFn.usage){
      return this.singleCommandUsage(cmdFn, cb);
    }
    
    return this.singleCommandManPage(cmds, cmdFn, cb);
  },
  fhcUsage : function(cb){
    var commands = fhc._tree,
    v = fhc.config.get('fhversion') || 3,
    mergedCommands = {};
    _.extend(mergedCommands, commands['fh' + v], commands.common);
    
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
  /*
    Wrapper on commandGroupUsage which differs:
    1 - We want this to appear as an error to the user. 
    2 - We want to tell the user they forgot to specify an action.
    */
  commandGroupUsageError : function(cmds, cmdFn, cb){
    this.commandGroupUsage(cmds, cmdFn, function(err, usageRes){
      res = 'No action specified. Usage: \n' +  usageRes;
      return cb(res);
    });
  },
  singleCommandUsage : function(cmdFn, cb){
    var msg = [];
    if (cmdFn.describe){
      // new style commands with a describe property can automatically generate the usage
      msg.push(argUtils.yargsUsage(cmdFn));
    }else{
      // All we can go on with old-style commands is the usage string
      var usageStr = cmdFn.usage_ngui || cmdFn.usage || 'No usage for this command found';
      msg.push(usageStr);  
    }
    return cb(null, msg.join('\n'));
  },
  /*
  For use in auto-doc generation, returns a markdown-ified 
  version of singleCommandUsage with some sugar
   */
  singleCommandUsageToMd : function(cmdFn, cb){
    this.singleCommandUsage(cmdFn, function(err, usage){
      if (err){
        return cb(err);
      }
      var title = 'fhc-' + cmdFn._cmdName + '(1)\n';
      title += Array(title.length).join('=') + '\n';
      usage = title + usage;
      usage = usage.replace(/^Usage:$/gm, '## SYNOPSIS\n');
      usage = usage.replace(/^Examples:$/gm, '## EXAMPLES\n');
      usage = usage.replace(/^Options:$/gm, '## OPTIONS\n');
      
      usage += '\n## DESCRIPTION';
      usage += '\n\n';
      usage += cmdFn.desc;
      usage += '\n\n';
      return cb(null, usage);
    });
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
        // Return something useful - don't error our here
        // TODO: Decide if missing man page is worth alerting?
        self.singleCommandUsage(cmdFn, cb);
      } 
      var manpath = path.join(__dirname, "..", "..", ".."), 
      env = _.clone(process.env);
      env.MANPATH = manpath;
      console.log(manpath);
      console.log(section);
      console.log(section_path);
      exec("man", [section_path], env, true, function(err, data){
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
