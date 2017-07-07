var USER_API_KEY = "user_api_key";
var ini = require("./ini.js");


exports.getUserApiKey = function() {
  return ini.get(USER_API_KEY);
};

exports.delUserApiKey = function() {
  ini.del(USER_API_KEY);
};