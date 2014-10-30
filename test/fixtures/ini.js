

module.exports = function(configMap){
  var ini = {
    get : function(key){
      return configMap[key];
    }
  };
  return ini;
}
