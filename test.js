"use strict";

var fh = require("./");
var http = require("http");

var options = {
      host: "https://apps.feedhenry.com",
      domain: "apps",
      login: ""
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
    username = process.argv[2] || "",
    password = process.argv[3] || "";


var tests = {

  'login': function(cb) {
    fh.auth.login(options, username, password, function(error, data) {
        console.log(data);
        if(!error) {
          options.login = data.login;
        }
        cb(error);
      }
    );
  },

  // 'version': function(cb) {
  //   fh.version(options, function(error, data) {
  //     console.log(arguments);
  //     cb(error);
  //   });
  // },

  // 'read user': function(cb) {
  //   fh.user.read(options, function(error, data) {
  //     console.log(arguments);
  //     cb(error);
  //   });
  // },

  // 'list apps': function(cb) {
  //   fh.apps.list(options, function(error, data) {
  //     console.log(arguments);
  //     if(data && data.list) {
  //       apps = data.list;
  //     }
  //     cb(error);
  //   })
  // },


  // 'build': function(cb) {
  //   fh.build(options, apps[0].id, {
  //     version: "2.3",
  //     destination: "android",
  //     config: "debug",
  //     stage: false
  //   }, function(error, data) {
  //     console.log(error, data);

  //     fh.api.waitFor(options, data.cacheKey, function(error, data) {
  //       console.log(data);
  //       if(data.status !== "pending") {
  //       	cb(error);
  //       }
  //     });
  //   })
  // },

  // 'create app': function(cb) {
  //   fh.apps.create(options, "testApp", "git@github.com:danielconnor/test.git", "master", function(error, data) {
  //     console.log(arguments);
  //     createdApp = data;
  //     cb(error);
  //   });
  // },

  // 'read app': function(cb) {
  //   var appId = createdApp ? createdApp.guid : apps[0] ? apps[0].id : null;

  //   if(appId) {
  //     fh.apps.read(options, appId, function(error, data) {
  //       console.log(arguments);
  //       cb(error);
  //     });
  //   }
  //   else {
  //     console.log("No apps to read");
  //   }
  // },

  // 'git pull': function(cb) {
  //   if(createdApp) {
  //     fh.git.pull(options, createdApp.guid, function(error, data){
  //       console.log(arguments);

  //       cb(error);
  //     });
  //   }
  //   else {
  //     cb(true);
  //   }
  // },

  // 'read files': function(cb) {
  //   var app = apps[0];
  //   if(app) {
  //     fh.files.list(options, app.id, function(error, data){
  //       console.log(arguments);
  //       cb(error);
  //     });
  //   }
  // },

  // 'list config': function(cb) {
  //   var app = createdApp || apps[0];

  //   if(app) {
  //     fh.config.list(options, app.guid, "all", function(error, data) {
  //       console.log(arguments);
  //       cb(error);
  //     });
  //   }
  //   else {
  //     console.log("No apps to read");
  //   }
  // },

  // 'search apps': function(cb) {
  //   fh.apps.search(options, "testApp", function(error, data) {
  //     console.log(arguments);
  //     cb(error);
  //   });
  // },

  // 'remove app': function(cb) {
  //   if(createdApp) {
  //     fh.apps.remove(options, createdApp.guid, function(error, data) {
  //       console.log(arguments);
  //       cb(error);
  //     });
  //   }
  // },
  'list resources': function(cb) {
    fh.resources.list(options, "android", function(err, data) {
      console.log(data);

      cb(err);
    });
  },

  'upload': function(cb) {


    fh.resources.upload(options, {
      fields: {
        dest: "iphone",
        resourceType: "privatekey",
        buildType: "distribution"
      },
      filename: "C:\\Users\\Daniel\\Dropbox\\FeedHenry-App-Resources\\iOS\\Enterprise\\20110808\\private keys\\privatekey.p12"

    }, function(err, res) {
      console.log(res);
      cb(err);
    });
  },

  'logout': function(cb) {
    fh.auth.logout(options, function(error, data) {
      //console.log(arguments);
      cb(error);
    });
  }
};


(function() {

  if(!username || !password) {
    console.log("please edit a username and password for the tests to work");
    return;
  }

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
