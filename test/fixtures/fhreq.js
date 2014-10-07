module.exports = function(responseMap){
  var fhreq = {
    GET : function(url, urlPrefix, cb){
      var args = Array.prototype.concat(['GET'], Array.prototype.slice.call(arguments, 0));
      return this._handle.apply(this, args);
    },
    PUT : function(url, urlPrefix, document, cb){
      var args = Array.prototype.concat(['PUT'], Array.prototype.slice.call(arguments, 0));
      return this._handle.apply(this, args);
    },
    POST : function(url, urlPrefix, document, cb){
      var args = Array.prototype.concat(['POST'], Array.prototype.slice.call(arguments, 0));
      return this._handle.apply(this, args);
    },
    DELETE : function(url, urlPrefix, document, cb){
      var args = Array.prototype.concat(['DELETE'], Array.prototype.slice.call(arguments, 0));
      return this._handle.apply(this, args);
    },
    _handle : function(method, url, urlPrefix, document, cb){
      if (arguments.length === 4){
        cb = document;
      }
      var responseKey = method + ' ' + urlPrefix,
      response = responseMap[responseKey];
      if (typeof response === 'function'){
        response = response(document);
      }else if (!response){
        console.log(responseMap)
        console.log('Warning: no response found in map for key ' + responseKey);
      }
      return cb(null, response, 'raw body does not matter', { statusCode : 200 });
    }
  };
  return fhreq;
}
