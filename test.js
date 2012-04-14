"use strict";

var fh = require("./");

var options = {
      host: "https://apps.feedhenry.com",
      domain: "apps",
      cookie: ""
    },
    apps = [],
    createdApp = null,
    colors = {
      red   : '\u001b[31m',
      green : '\u001b[32m',
      blue  : '\u001b[34m',
      cyan  : '\u001b[36m',
      reset : '\u001b[0m'
    },
    username = "",
    password = "";


var tests = {

  'login': function(cb) {
    fh.auth.login(options, username, password, function(error, data) {
        console.log(arguments);
        if(!error) {
          options.cookie = data.login;
        }
        cb(error);
      }
    );
  },

  'version': function(cb) {
    fh.version(options, function(error, data) {
      console.log(arguments);
      cb(error);
    });
  },

  'read user': function(cb) {
    fh.user.read(options, function(error, data) {
      console.log(arguments);
      cb(error);
    });
  },

  'list apps': function(cb) {
    fh.apps.list(options, function(error, data) {
      console.log(arguments);
      if(data && data.list) {
        apps = data.list;
      }
      cb(error);
    })
  },

  'create app': function(cb) {
    fh.apps.create(options, "testApp", "git@github.com:danielconnor/test.git", "master", function(error, data) {
      console.log(arguments);
      createdApp = data;
      cb(error);
    });
  },

  'read app': function(cb) {
    var app = createdApp || apps[0];

    if(app) {
      fh.apps.read(options, app.guid, function(error, data) {
        console.log(arguments);
        cb(error);
      });
    }
    else {
      console.log("No apps to read");
    }
  },

  'list config': function(cb) {
    var app = createdApp || apps[0];

    if(app) {
      fh.config.list(options, app.guid, "all", function(error, data) {
        console.log(arguments);
        cb(error);
      });
    }
    else {
      console.log("No apps to read");
    }
  },

  'search apps': function(cb) {
    fh.apps.search(options, "testApp", function(error, data) {
      console.log(arguments);
      cb(error);
    });
  },

  'remove app': function(cb) {
    if(createdApp) {
      fh.apps.remove(options, createdApp.guid, function(error, data) {
        console.log(arguments);
        cb(error);
      })
    }
  },

  'logout': function(cb) {
    fh.auth.logout(options, function(error, data) {
      console.log(arguments);
      cb(error);
    });
  }
};


(function() {

  if(!username || !password) 
    console.log("please edit the username and password for the tests to work");

  var successful = 0,
      total = 0;

  var keys = Object.keys(tests);
  (function run(name) {
    if(name) {
      console.log("starting test", name);

      tests[name]( function(error) {

        total++;
        !error && successful++;

        console.log(colors.cyan + name, 
          "test finished", 
          !error ? colors.green + "successfully!" : colors.red + "unsuccessfully!",
          colors.reset,
          "\n\n");

        if(keys.length) {
          run(keys.shift());
        }
        else {
          console.log(colors.green + successful + "/" + total + colors.reset + " tests succeeded\n" +
            colors.red + (total - successful) + "/" + total + colors.reset + " tests failed")
        }
      });
    }
  })(keys.shift());

})();
