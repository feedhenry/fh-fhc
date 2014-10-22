var _ = require('underscore'),
path = require('path'),
fs = require('fs'),
configDefs = require('./config-defs');
const configFile = path.resolve(process.env.HOME, ".fhcrc");
module.exports = {
  store : {},
  userStore : {},
  resolved : true,
  getConfigFromDisk : function(cb){
    var self = this;
    fs.readFile(configFile, function(err, file){
      if (err){
        return cb('Error reading user config file');
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
        val = parseInt(num, 10);
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
  },
  get : function(key){
    return this.store[key];
  },
  del : function(key){
    delete this.store[key];
    delete this.userStore[key];
  },
  getEnvironment : function(){
    return this.store['env'];
  },
  save : function(cb){
    var lines = _.map(this.userStore, function(val, key){
      return key + " = " + val;
    });
    lines = lines.join('\n');
    fs.writeFile(configFile, lines, cb);
  }
  
};
