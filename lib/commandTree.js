var fs = require('fs'),
_ = require('underscore'),
async = require('async'),
path = require('path'),
cbCalled = false;

function _removeDotFiles(list){
  return _.reject(list, function(d){
    return d[0] === '.'; // no dotfiles
  });
}

module.exports = function(cb){
  var commands = {},
  cmdDir = path.join(__dirname, 'cmd');
  fs.readdir(cmdDir, function(err, commandGroups){
    if (err){
      return cb(err);
    }
    var commandGroupGetters = {};
    
    commandGroups = _removeDotFiles(commandGroups);
    commandGroups.forEach(function(commandGroupName){
      commandGroupGetters[commandGroupName] = function(cb){
        fs.readdir(path.join(cmdDir, commandGroupName), function(err, commands){
          var commandGroupCommands = {};
          if (err){
            return cb(err);
          }
          
          commands = _removeDotFiles(commands);
          
          commands.forEach(function(command){
            var commandName = command.replace(/.js$/, '');
            var fullPath = path.join(__dirname, 'cmd', commandGroupName, command);
            try{
              commandGroupCommands[commandName] = require(fullPath);  
            }catch(err){
              console.log('requiring ' + fullPath)
              console.log(err);
              return cb(err);
            }
          });
          return cb(null, commandGroupCommands);
        });  
      } // end getter  
    });
    return async.parallel(commandGroupGetters, function(err, tree){
      if (!cbCalled){
        cbCalled = true;
        return cb(err, tree);  
      }
    });
  });
}
