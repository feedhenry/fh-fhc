// used in test_version
var mockVersion = { Environment: 'production',
    'Millicore svn revision': '12384',
    Node: 'node01',
    Release: 'IR160',
    'Revision Date': '2011-07-22 10:53:22 +0100 (Fri, 22 Jul 2011)',
    _etag: '"ohmdg8b8lHKqzGIIl20-mF"' };

// used in test_apps
var mockAppList = {
    "list": [{
      "config": {"preview": {"device": "iphone_3"}},
      "description": "This app demonstrates how to use client-side packages to customise application behavior and appearance. It is also the application that is used in the \"App Anatomy\" help document - http://docs.feedhenry.com/wiki/App_Anatomy  ",
      "id": "c0TPJtvFbztuS2p7NhZN3oZz",
      "modified": "2011-05-09 12:14:45",
      "title": "Cloned App Anat",
      "version": 12,
      "width": 320
    }]
};

var mockAppRead = {  
    "app": {
      "config": {},
      "guid": "c0TPJzF6ztq0WjezxwPEC5W8",
      "type": "",
      "w3cid": "com.gmail.dberesford.cloned.app.anat"
    },
    "inst": {
      "config": {"preview": {"device": "iphone_3"}},
      "description": "This app demonstrates how to use client-side packages to customise application behavior and appearance. It is also the application that is used in the \"App Anatomy\" help document - http://docs.feedhenry.com/wiki/App_Anatomy  ",
      "guid": "c0TPJtvFbztuS2p7NhZN3oZz",
      "height": 480,
      "title": "Cloned App Anat",
      "width": 320
    },
    "status": "ok",
    "_etag": "\"9MivSOQ-3BCUBr0X8hvZjk\""
};

var mockAppDelete = {
    "inst": {
      "id": "vMjTeuszvyOKzfERgXlWc721",
      "title": "foo"
    },
    "status": "ok",
    "_etag": "\"fwY6WBcro_FalLPvn6sWB-\""
};

var mockAppCreate = {
    "guid": "Ts0J1_NG799HL8ER4arN3LKZ",
    "status": "ok",
    "tasks": ["8dc3da1987bc66c8676ed51c21798479"],
    "_etag": "\"kP99hYXTFI6RIs5xpi2N2F\""
};

var mockAppLogs ={
    "logs": {
      "stderr": "",
      "stdout": "App started at: Mon Aug 08 2011 09:35:19 GMT+0100 (IST)\n"
  },
  "status": "ok",
  "_etag": "\"-rMaJtvcwonA6xPEQ5lNMk\""
};

// used in test_act
var mockAct ={
    status: 'ok'
};

var mockWidgetRead = { app: 
{ config: {},
  guid: 'Hi8lP6K1TV1cr6EB6a0I3P1v',
  type: '',
  w3cid: 'ie.wit.mail.20041789.foo' 
}}; 

// used in test_files
var mockWidgetRead = { app: 
{ config: {},
  guid: 'Hi8lP6K1TV1cr6EB6a0I3P1v',
  type: '',
  w3cid: 'ie.wit.mail.20041789.foo' 
}};

var mockFileRead = {
    "contents": "var c = \"Welcome to Waterford\";\n",
    "created": "Wed Jul 20 10:49:36 IST 2011",
    "fileName": "test.js",
    "filePath": "/client/default/js/",
    "guid": "ZYeFBUgw8qLSfzfts-vP53iu",
    "isBinary": false,
    "isDirectory": false,
    "modified": "Fri Jul 22 09:28:01 IST 2011",
    "status": "ok",
    "version": 70,
    "_etag": "\"HI51UacMWn1k8dE6O0qvS-\""
};
var mockFileList = {
    "children": [
                 {
                     "children": [
                     {
                         "children": [
                         {
                             "children": [
                             {
                                 "guid": "ZYeFBIZG60dG-EhNV1RiXdki",
                                 "name": "style.css",
                                 "path": "/client/default/css/style.css",
                                 "type": "file"
                             }],
                             "guid": "ZYeFBIZG60dG-EhNV1RiXdki",
                             "name": "css",
                             "path": "/client/default/css",
                             "type": "folder"
                         }, {
                             "children": [
                             {
                                 "guid": "ZYeFBJJIrui-TRHFCmHNebSG",
                                 "name": "init.js",
                                 "path": "/client/default/js/init.js",
                                 "type": "file"
                             }, {
                                 "guid": "ZYeFBUgw8qLSfzfts-vP53iu",
                                 "name": "test.js",
                                 "path": "/client/default/js/test.js",
                                 "type": "file"
                             }],
                             "guid": "ZYeFBJJIrui-TRHFCmHNebSG",
                             "name": "js",
                             "path": "/client/default/js",
                             "type": "folder"
                         }, {
                             "guid": "ZYeFBFAQ8e0eeljmVTFZAIUT",
                             "name": "index.html",
                             "path": "/client/default/index.html",
                             "type": "file"
                         }],
                         "guid": "ZYeFBFAQ8e0eeljmVTFZAIUT",
                         "name": "default",
                         "path": "/client/default",
                         "type": "folder"
                     }],
                     "guid": "ZYeFBFAQ8e0eeljmVTFZAIUT",
                     "name": "client",
                     "path": "/client",
                     "type": "folder"
                 }, {
                     "children": [
                     {
                         "guid": "ZYeFBREvJHNpu4WOtarJzEag",
                         "name": "main.js",
                         "path": "/cloud/main.js",
                         "type": "file"
                     }],
                     "guid": "ZYeFBREvJHNpu4WOtarJzEag",
                     "name": "cloud",
                     "path": "/cloud",
                     "type": "folder"
                 }, {
                     "children": [
                     {
                         "guid": "ZYeFBKtlNkJzJGc6hwC9hnCm",
                         "name": "config.js",
                         "path": "/shared/config.js",
                         "type": "file"
                     }],
                     "guid": "ZYeFBKtlNkJzJGc6hwC9hnCm",
                     "name": "shared",
                     "path": "/shared",
                     "type": "folder"
                 }],
                 "name": "/",
                 "path": "",
                 "status": "ok",
                 "type": "folder"
             };

var mockFileUpdate = {
    "status": "ok",
    "_etag": "\"2kGtWojqx9Rc38alMU8w8k\""
};

var mockFileCreate = 
{ guid: 'rDfYZYkRMYfEGaREzgm9Mu-5',
    path: '/client/default/js/test14432.js',
    status: 'ok',
    type: 'file',
    _etag: '"o7yKfmI65bg-A9PLf21Jj-"' };

var mockFileDelete = { status: 'ok',
    _etag: '"2kGtWojqx9Rc38alMU8w8k"' };

// used by test_login
var mockLogin = 'login ok';

// used by test_messaging
var mockMsgPing = 'ok';

var mockMsgVersion = '0.5.0-39';

var mockMsgStats = 
{
    appinit: 545786,
    fhweb: 22400756,
    appcreate: 525,
    useraccess: 3896,
    appdelete: 228,
    appbuild: 1732,
    usercreate: 209,
    useractivate: 179,
    appexport: 124,
    fhact: 14131439,
    profile: 0
};

var mockMsgTopics = 'appinit, fhweb, appcreate, useraccess, appdelete, appbuild, usercreate, useractivate, appexport, fhact, profile ';

var mockMsgTopic = ' ';

var mockMsgTopicQuery = ' ';

// used by test_ping
var mockPing = '1346820696';

// used by test_props
var mockPropsDomain = {"_etag":"lFtPn8gbY3jeHdB2_zEhGV"};

var mockPropsApp = 
    {"status": "ok",
    "list": [
      {
          "config": {
              "preview": {
                  "device": "generic"
              }
          },
          "description": "A tabbed application which displays news feeds",
          "id": "pviryBwt22iZ0iInufMYBuVV",
          "modified": "2011-07-28 13:27:30",
          "title": "tempApp",
          "version": 0,
          "width": 320
      }, {
          "config": {
              "nodejs": {
                  "enabled": "true"
              },
              "preview": {
                  "device": "iphone_3"
              }
          },
          "description": "First App",
          "id": "ZYeFBUOfKr7peAtIvTHY4R0F",
          "modified": "2011-07-28 14:34:12",
          "title": "Test",
          "version": 92,
          "width": 320
      }, {
          "config": {
              "nodejs.enabled": "true"
          },
          "description": "test123",
          "id": "rDfYZe-Lz5RGTRQQsIV9ovFn",
          "modified": "2011-07-27 12:14:02",
          "title": "test123",
          "version": 21,
          "width": 200
      }],
  "nodejs": { "enabled": "true"},
     
  "preview": {"device": "iphone_3"}
  };

var mockPropsSet =  {
  "nodejs": {
      "enabled": "true"
  },
  "preview": {
      "device": "iphone_3"
  },
  "status": "ok",
  "_etag": "\"7b0MApSNXzjQt1B1q_1LdV\""
};

// test_user
var mockUser = {
    displayName: 'Foo Bar',
    domain: 'apps',
    email: 'foo@bar.com',
    status: 'ok',
    userName: 'Foo Bar',
    _etag: '"RV9Ov_q6UfyOx8kljDkQU-"'
};

var mockCacheKeys = [ [ { action: {},
      cacheKey: '64efeddd8790921819d62efaf4dedf79',
      error: '',
      log: [Object],
      status: 'complete' } ] ];

function mockRequest (fhurl, method, where, what, etag, nofollow, cb_) {
  if (typeof cb_ !== "function") cb_ = nofollow, nofollow = false;
  if (typeof cb_ !== "function") cb_ = etag, etag = null;
  if (typeof cb_ !== "function") cb_ = what, what = null;
  var err = null, parsed, data, response;

  if (where == 'box/srv/1.1/ide/apps/app/list') {
    data = mockAppList;
  }else if (where == 'box/srv/1.1/ide/apps/app/read') {
    data = mockAppRead;
  }else if (where == 'box/srv/1.1/ide/apps/app/delete') {
    data = mockAppDelete;
  }else if (where == 'box/srv/1.1/ide/apps/app/create') {
    data = mockAppCreate;
  }else if (where == 'box/srv/1.1/ide/apps/app/logs') {
    data = mockAppLogs;
  }else if (where == 'box/srv/1.1/tst/version'){
    data = mockVersion;                      
  }else if (where == 'box/srv/1.1/act/apps/c0TPJzF6ztq0WjezxwPEC5W8/getCloudData/0123') {
    data = mockAct;
  }else if (where == 'box/srv/1.1/ide/apps/app/read') {
    data = mockWidgetRead;
  }else if (where == 'box/srv/1.1/ide/apps/file/list') {
    data = mockFileList;                      
  }else if (where == 'box/srv/1.1/ide/apps/file/read') {
    data = mockFileRead;
  }else if (where == 'box/srv/1.1/ide/apps/app/read') {
    data = mockWidgetRead;
  }else if (where == 'box/srv/1.1/ide/apps/file/update') {
    data = mockFileUpdate;
  }else if (where == 'box/srv/1.1/ide/apps/file/delete') {
    data = mockFileDelete;
  }else if (where == 'box/srv/1.1/ide/apps/file/create') {
    data = mockFileCreate;
  }else if (where == '/box/srv/1.1/act/sys/auth/login') {
    data = mockLogin;
  }else   if (where == 'sys/info/ping') {
    data = mockMsgPing;                      
  }else if (where == 'sys/info/version') {
    data = mockMsgVersion;
  }else if (where == 'sys/info/stats'){
    data = mockMsgStats;
  }else if (where == 'msg'){
    data = mockMsgTopics;
  }else if (where == 'msg/profile'){
    data = mockMsgTopic;
  }else if (where == 'msg/profile'+'?'+'123'){
    data = mockMsgTopicQuery;
  }else  if (where == 'box/srv/1.1/tst/randomint') {
    data = mockPing;                      
  }else if (where == 'box/srv/1.1/sys/admin/domain/props?d=apps'){
    data = mockPropsDomain;                      
  }else if (where == 'box/srv/1.1/ide/apps/app/list'){
    data = mockPropsApp;
  }else if (where == 'box/srv/1.1/ide/apps/app/setconfig'){
    data = mockPropsSet;
  }else if (where == 'box/srv/1.1/ide/apps/user/read'){
    data = mockUser;                      
  }else if (where == 'box/srv/1.1/dat/log/read?cacheKeys=[{%22cacheKey%22:%228dc3da1987bc66c8676ed51c21798479%22,%22start%22:0}]') {
    data = mockCacheKeys;
  }else {
    throw new Error('Unhandled endpoint! ' +  where);
  }
  return cb_(err, data, JSON.stringify(data), data);
};

exports.mockRequest = mockRequest;