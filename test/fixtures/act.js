var request = function(params, cb){
  var uri = params.uri || params.url,
  body = {};
  switch(true){
    case uri.match(/https:\/\/*.+-dev.feedhenry.com/)!=null:
      body = { status : 'ok' };
      break;
    case uri.match(/https:\/\/*.+-live.feedhenry.com/)!=null:
      body = { status : 'ok', live : true };
      break;
  }
  return cb(null, { statusCode : 200 }, body);
};
request.defaults = function(){
  return request;
};

module.exports = request;
