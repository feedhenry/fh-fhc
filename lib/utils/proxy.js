exports.configureProxy = function(req, proxy) {
  if (!proxy) {
    return req;
  }

  return req.defaults({proxy: proxy});
};
