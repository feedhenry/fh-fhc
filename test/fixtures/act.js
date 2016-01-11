var request = function (params, cb) {
  var uri = params.uri || params.url,
    body = {};
  if (uri.match(/https:\/\/*.+-dev.feedhenry.com/)) {
    body = {status: 'ok'};
  } else if (uri.match(/https:\/\/*.+-live.feedhenry.com/)) {
    body = {status: 'ok', live: true};
  }
  return cb(null, {statusCode: 200}, body);
}
request.defaults = function () {
  return request;
};

module.exports = request;
