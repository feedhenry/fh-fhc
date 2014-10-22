module.exports = messaging;
messaging.pingVersion = pingVersion;
messaging.topics = topics;
messaging.topic = topic;
messaging.query_topic = query_topic;
messaging.message = message;

messaging.usage = "\nfhc messaging ping"
  + "\nfhc messaging version"
  + "\nfhc messaging stats"
  + "\nfhc messaging topics"
  + "\nfhc messaging topic <topic> <query>"
  + "\nfhc messaging message <topic> <id>";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");

// main messaging entry point
function messaging (args, cb) {
  var action = args.shift();
  switch (action) {
  case "ping": return pingVersion("ping", cb);
  case "version": return pingVersion("version", cb);
  case "stats": return pingVersion("stats", cb);
  case "topics": case "ls": return topics(cb);
  case "topic":  {
      if (args.length !== 1 && args.length !== 2) return unknown("topic", cb);
      else{
        if (args.length === 1) return topic(args[0], cb);
        else return query_topic(args[0], args[1], cb);
      }
  }
  case "message":  {
      if (args.length !== 2) return unknown("message", cb);
      else return message(args[0], args[1], cb);
  };
  default: return unknown(action, cb);
  }
}

function pingVersion (pingOrVersion, cb) {
  fhreq.GET(fhreq.getMessagingUrl(), "sys/info/" + pingOrVersion, function (err, remoteData, raw, response) {
    return cb(err, remoteData);
  });
}

function topics (cb) {
  fhreq.GET(fhreq.getMessagingUrl(), "msg", function (err, remoteData, raw, response) {
    return cb(err, remoteData);
  });
}

function topic(topic, cb) {
  fhreq.GET(fhreq.getMessagingUrl(), "msg/" + topic, function (err, remoteData, raw, response) {
    return cb(err, remoteData);
  });
}

function query_topic(topic, query, cb) {
  fhreq.GET(fhreq.getMessagingUrl(), "msg/" + topic + "?" + query, function (err, remoteData, raw, response) {
    return cb(err, remoteData);
  });
}

function message(topic, id, cb) {
  fhreq.GET(fhreq.getMessagingUrl(), "msg/" + topic + "/" + id, function (err, remoteData, raw, response) {
    return cb(err, remoteData);
  });
}

function unknown (action, cb) {
  cb("Wrong arguments for or unknown action: " + action + "\nUsage:\n" + messaging.usage);
}

// bash completion
messaging.completion = function (opts, cb) {
  console.log(opts);
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "messaging") argv.unshift("messaging");
  if (argv.length === 2) {
    var cmds = ["ping", "version", "stats", "topics", "topic", "message"];
    return cb(null, cmds);
  }

  var action = argv[2];
  switch (action) {
    // todo: complete with valid values, if possible.
    case "ping":
    case "version":
    case "stats":
    case "topics":
    case "topic":
    case "message":
    //  return cb(null, Object.keys(types)); // TODO - 'types' undefined here, check with author what the intent was here
    default: return cb(null, []);
  }
};
