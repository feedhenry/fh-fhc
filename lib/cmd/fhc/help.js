/* globals i18n */
var fhc = require('../../fhc');
var usage = require('../../usage');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var argUtils = require('../../utils/args');
var spawn = require('child_process').spawn;

module.exports = {
  'desc': i18n._('Help with the FeedHenry Command'),
  'examples': [
    {cmd: 'fhc help', desc: i18n._('Retrieves help for all of FHC')},
    {cmd: 'fhc help app', desc: i18n._('Retrieves help with the app command')}
  ],
  'demand': [],
  'alias': {},
  globalFlags: {
    '--json': {
      desc: i18n._('Forces the return of JSON output even if config is set otherwise - useful in scripts'),
      usage: '--json'
    },
    '--table': {desc: i18n._('Forces the return of table output even if config is set otherwise'), usage: '--table'}
  },
  'customCmd': function (argv, cb) {
    var command = argv._,
      cmdFn = fhc,
      cmds = [],
      cmd;

    if (!command || command.length === 0) {
      return this.fhcUsage(cb);
    }

    // Find the fhc command from the tree
    cmdFn = fhc;
    cmd = argv._.shift();
    while (cmd) {
      cmds.push(cmd);
      cmdFn = cmdFn[cmd];
      cmd = argv._.shift();
    }

    if (!cmdFn) {
      return cb(i18n._('Error - command not found: ') + cmds.join(' '));
    }

    // Objects only appear when it's a command group
    if (typeof cmdFn === 'object' && argv._ && argv._.length === 0) {
      return this.commandGroupUsage(cmds, cmdFn, cb);
    }

    if (fhc.config.get("usage") && cmdFn.usage) {
      return this.singleCommandUsage(cmdFn, cb);
    }

    return this.singleCommandDocPage(cmds, cmdFn, cb);
  },
  fhcUsage: function (cb) {
    var commands = fhc._tree,
      v = fhc.config.get('fhversion') || 3,
      mergedCommands = {};
    _.extend(mergedCommands, commands['fh' + v], commands.common);

    mergedCommands._groupName = 'fhc';

    var commandsList = usage(mergedCommands),
      usageList = usage(commands.fhc);

    var msg = [i18n._("FeedHenry CLI, the Command Line Interface to FeedHenry.")];
    msg.push(i18n._("\nUsage: fhc <command>"));
    msg.push("");
    msg.push(i18n._("where <command> is one of: "));
    msg.push(commandsList);
    msg.push(i18n._("\nor an FHC command: "));
    msg.push(usageList);
    msg.push('', this._globalFlags());
    msg.push(i18n._("\nAdd --help to any command for quick help, or use fhc help <command>."));
    return cb(null, msg.join('\n'));
  },
  commandGroupUsage: function (cmds, cmdFn, cb) {
    var msg = [];
    msg.push('fhc ' + cmds.join(' ') + i18n._(' <action>'));
    msg.push(i18n._('Where <action> is one of:'));
    msg.push(usage(cmdFn));
    return cb(null, msg.join('\n'));
  },
  /*
   Wrapper on commandGroupUsage which differs:
   1 - We want this to appear as an error to the user.
   2 - We want to tell the user they forgot to specify an action.
   */
  commandGroupUsageError: function (cmds, cmdFn, cb) {
    this.commandGroupUsage(cmds, cmdFn, function (err, usageRes) {
      var response = i18n._('No action specified. Usage: \n') + usageRes;
      return cb(response);
    });
  },
  singleCommandUsage: function (cmdFn, cb) {
    var msg = [];
    if (cmdFn.describe) {
      // new style commands with a describe property can automatically generate the usage
      msg.push(argUtils.yargsUsage(cmdFn));
    } else {
      // All we can go on with old-style commands is the usage string
      var usageStr = cmdFn.usage_ngui || cmdFn.usage || i18n._('No usage for this command found');
      msg.push(usageStr);
    }
    return cb(null, msg.join('\n'));
  },
  /*
   For use in auto-doc generation, returns a markdown-ified
   version of singleCommandUsage with some sugar
   */
  singleCommandUsageToMd: function (cmdFn, cb) {
    this.singleCommandUsage(cmdFn, function (err, usage) {
      if (err) {
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
  singleCommandDocPage: function (cmds, cmdFn, cb) {
    var command = fhc;
    while (cmds.length > 0) {
      command = command[cmds.shift(1)];
    }
    var section_path = path.join('doc', command._path.replace(/\.js$/, '.md'));

    var self = this;
    return fs.stat(section_path, function (err) {
      if (err) {
        // Return something useful - don't error our here
        return self.singleCommandUsage(cmdFn, cb);
      }
      // TODO Use latest nodejs api. customFds is deprecated
      var child = spawn('less', [section_path], {customFds: [0, 1, 2]});
      if(child.stderr){
        child.stderr.on('data', function (data) {
          err = err || '';
          err += data;
        });
      }
      child.on('close', function (code) {
        if (code !== 0) {
          return cb('Error: ' + err);
        }
        return cb(err, '');
      });
      return;
    });
  },
  _globalFlags: function () {
    var msg = [];
    msg.push(i18n._('Global Options'));
    msg.push(usage(this.globalFlags));
    return msg.join('\n');
  }
};
