var _ = require('underscore'),
path = require('path'),
fs = require('fs'),
log = require('./log'),
configDefs = require('./config-defs');
const configFile = path.resolve(process.env.HOME || process.env.USERPROFILE, ".fhcrc");
module.exports = {
  store : {},
  userStore : {},
  resolved : true,
  getConfigFromDisk : function(cb){
    var self = this;
    fs.readFile(configFile, function(err, file){
      if (err){
        if (err.code === 'ENOENT'){
          // We need to write the config file
          return fs.writeFile(configFile, '', function(writeError, res){
            if (writeError){
              return cb(err);
            }
            return cb(null, {});
          });
        }else{
          return cb('Error reading user config file');  
        }
      }
      var lines = file.toString().split('\n'),
      fileConfig = {};
      _.each(lines, function(line){
        if (_.isEmpty(line.trim()) || line.indexOf(' = ')===-1){
          return;
        }
        var split = line.split(' = '),
        key = split[0],
        val = split[1];
        val = self.enforceType(key, val);
        fileConfig[key] = val;
      });
      return cb(null, fileConfig);
    });
  },
  enforceType : function(key, val){
    var types = configDefs.types,
    type;
    if (!_.has(types, key)){
      return val;
    }
    type = types[key];
    switch(type){
      case Boolean:
        val = val === 'true';
        break;
      case Number:
        val = parseInt(val, 10);
        break;
    }
    return val;
  },
  saveConfigToDisk : function(){
    
  },
  init : function(config, cb){
    this.argv = config.argv;
    var self = this;
    cliArguments = _.omit(config.argv, '_', '$0');
    this.getConfigFromDisk(function(err, configFromDisk){
      if (err){
        return cb(err);
      }
      self.userStore = configFromDisk;
      _.extend(self.store, configDefs.defaults, configFromDisk, cliArguments);
      return cb(null, self.store);
    });
  },
  set : function(key, value, which){
    // TODO Implement the old which stuff
    this.userStore[key] = value;
    _.extend(this.store, this.userStore);
    return value;
  },
  get : function(key){
    return this.store[key];
  },
  del : function(key){
    delete this.store[key];
    delete this.userStore[key];
  },
  getEnvironment : function(argv){
    var args = argv._;
    var env = argv.env || this.get('env');
    if (typeof args !== 'undefined' && typeof env === 'undefined'){
      for (var i=0; i<args.length; i++){
        var arg = args[i];
        // Current way of specifying arguments - this will provide for module require support, which env.get can't cater for
        if (arg.indexOf('--env=')>-1 && arg.split('=').length>1){
          env = arg.split('=')[1];
        }
        // Backwards compat & support fh-art
        if (arg === 'dev' || arg === 'live' || arg === 'development'){
          log.warn('Environment is now specified with the --env=<environment> flag');
          arg = (arg==='development') ? 'dev' : arg;
          // Pop off the arg, so it doesn't get confused for something else in a subsequent call
          args = args.splice(i, 1);
          env = arg;
        }
      }
    }
    // Apply defaults
    if (!env){
      log.error('Environment is mandetory - specify using --env=<environment>');
      throw new Error('Environment must be specified');
      
    }

    return env;
  },
  save : function(cb){
    var lines = _.map(this.userStore, function(val, key){
      return key + " = " + val;
    });
    lines = lines.join('\n');
    fs.writeFile(configFile, lines, cb);
  }
  
};
