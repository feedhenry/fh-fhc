var assert = require('assert');
var genericCommand = require('genericCommand');

var variantCmd = {
  add: genericCommand(require('cmd/fh3/ups/variant/add')),
  delete: genericCommand(require('cmd/fh3/ups/variant/delete')),
  list: genericCommand(require('cmd/fh3/ups/variant/list'))
};

var nock = require('nock');

var mockInitConfigApp = {
  "access_token": "eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI4ZTZlYjIxMC03ZGMxLTRjYzItYjY4Zi1kMTIzMTc2MTdhOWUiLCJleHAiOjE1MTQ5NzExMzAsIm5iZiI6MCwiaWF0IjoxNTE0OTcxMDcwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkwODEvYXV0aC9yZWFsbXMvYWVyb2dlYXIiLCJhdWQiOiJ1bmlmaWVkLXB1c2gtc2VydmVyLWpzIiwic3ViIjoiNzQ2YmViMGUtOTBlZi00MzA0LThiNTktZjczYjM4NGE2YTQwIiwiYXpwIjoidW5pZmllZC1wdXNoLXNlcnZlci1qcyIsInNlc3Npb25fc3RhdGUiOiIwNjgzMTQ2Ni1mNzc5LTRlMTMtOTI3Mi1lZTI1ZTg1MDgxOGQiLCJjbGllbnRfc2Vzc2lvbiI6IjMyOTkxZGJkLThmYmEtNDdmOC05OTI4LWRhMjZmZWQ1MmM5MiIsImFsbG93ZWQtb3JpZ2lucyI6W10sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZXZlbG9wZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbInZpZXctcHJvZmlsZSIsIm1hbmFnZS1hY2NvdW50Il19fSwibmFtZSI6IiIsInByZWZlcnJlZF91c2VybmFtZSI6InN1cHBvcnQifQ.FbT1LoqKXIE8y4frfWumfgIN3cS1P5Dx77kNfNjXlCsP1fuPRHVwMewbpdMyrbkLva_legb26VRfHXu_-Lcd2uZzINkGdFeqJJBPZ2NK2HQ9TcaBD102kvIy9G-xqZuV_nDRQWHXbnsyLbcFIaxCMQmypWAMYvUuPcYs-wMwaLm1rvcbtSNM_XykcGtmd0XrOqReovLHJRAWg6QaOT72vtz3GJncSUsucYpAkWbS4mOgpggRd5YpakUVJF7_abUfhHXIqs4Gz4FCEIResTPU8oj46kKC3S__rcAN1uc1xqC2vZq-g_mo8qFHHw3lpZGuU2lIELTZKpy6xlj61EEJXA",
  "expires_in": 60,
  "refresh_expires_in": 600,
  "refresh_token": "eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJmMDJhMWZiZC01OTNmLTQ1NzMtOTc2OC1mMGNmNTliZGM1YjEiLCJleHAiOjE1MTQ5NzE2NzAsIm5iZiI6MCwiaWF0IjoxNTE0OTcxMDcwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkwODEvYXV0aC9yZWFsbXMvYWVyb2dlYXIiLCJzdWIiOiI3NDZiZWIwZS05MGVmLTQzMDQtOGI1OS1mNzNiMzg0YTZhNDAiLCJ0eXAiOiJSRUZSRVNIIiwiYXpwIjoidW5pZmllZC1wdXNoLXNlcnZlci1qcyIsInNlc3Npb25fc3RhdGUiOiIwNjgzMTQ2Ni1mNzc5LTRlMTMtOTI3Mi1lZTI1ZTg1MDgxOGQiLCJjbGllbnRfc2Vzc2lvbiI6IjMyOTkxZGJkLThmYmEtNDdmOC05OTI4LWRhMjZmZWQ1MmM5MiIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZXZlbG9wZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbInZpZXctcHJvZmlsZSIsIm1hbmFnZS1hY2NvdW50Il19fX0.Y3UUDWmXvbwEI9Fc0gEYWu5vCXpADYFv0YvjbiHLfi3LmiErOIgGAsJBds-edXdvhGliV4MUFblcsU7LCwZ9qpXqXoyZq8wpSwY5CfO8l15R3B3vBjBud5c9Ejlhafq2VlQCbiIxN9Y0PTiP_FmHOfRKeN-c2C0KfNG1hz3H8NQsEili_jlAQiKmoPOApMWYANRDNNY8pc2Rcrhi38GskJ3Che4ZJ9x4t957BV_ADr190KKV6AsGTdHJ4U_XUkspyp7SM_RG14JTDz8Y_IsPtQIzHPSGO_FayxSJF0q1uXAkhbrocekTWJqLCEfmd3CITUta3OYqhPuzuFHRm6AoSA",
  "token_type": "bearer",
  "id_token": "eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJlMGNhYzFhOC1iMTY2LTRjNWMtOGZmOS0zNDkyMjEwMDY5NGUiLCJleHAiOjE1MTQ5NzExMzAsIm5iZiI6MCwiaWF0IjoxNTE0OTcxMDcwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkwODEvYXV0aC9yZWFsbXMvYWVyb2dlYXIiLCJhdWQiOiJ1bmlmaWVkLXB1c2gtc2VydmVyLWpzIiwic3ViIjoiNzQ2YmViMGUtOTBlZi00MzA0LThiNTktZjczYjM4NGE2YTQwIiwiYXpwIjoidW5pZmllZC1wdXNoLXNlcnZlci1qcyIsInNlc3Npb25fc3RhdGUiOiIwNjgzMTQ2Ni1mNzc5LTRlMTMtOTI3Mi1lZTI1ZTg1MDgxOGQiLCJuYW1lIjoiIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3VwcG9ydCJ9.YheI3KlM-CLuosbspeGaxbwH8WBIODz5YfE-dkY93bwWZeWp_k8p9Ueyt3rwpLtAxZs7wlwJP2V895F1xfy9LKFfF33TG8Wc5TwLf43jSm8FE1nyIROWtbxmo-0Yb1J6gM8cqWktsI-I6x2URMEdDjVCB7Q93Y6zJiTH0EULLT8w9J1Di0FxpXcu0OBQGkN8Qbf7ipIosArMMhRVmI4qN1XY2li2qZCCvXi0AO40xxCaLZZhz8njYWNz4MRa5NIEy73Ny83Kh2o7dN8nmSSF6jDN081xIBKywqT9jQTA5hov4bk50aJF1j64AdktW0YnnW_t6-rZ3QwlLvKzBQaryw",
  "not-before-policy": 0,
  "session-state": "06831466-f779-4e13-9272-ee25e850818d",
  "pushApplicationID": "974a2ebf-adc0-4e23-b186-5c17ca19fbfb"
};

module.exports = nock('https://apps.feedhenry.com')
  .get('/api/v2/ag-push/init/2a')
  .times(3)
  .reply(200, mockInitConfigApp )
  .post('/api/v2/ag-push/rest/applications/974a2ebf-adc0-4e23-b186-5c17ca19fbfb/android')
  .reply(200, {})
  .delete('/api/v2/ag-push/rest/applications/974a2ebf-adc0-4e23-b186-5c17ca19fbfb/android/3a')
  .reply(200, {})
  .get('/api/v2/ag-push/rest/applications/974a2ebf-adc0-4e23-b186-5c17ca19fbfb')
  .reply(200, {})

module.exports = {
  "test fhc variant list": function(cb) {
    variantCmd.list({app:'2a'}, function(err, data) {
      assert.equal(err, null);
      return cb();
    });
  },
  "test fhc variant add": function(cb) {
    variantCmd.add({app:'2a', name:'test', type:'android', serverKey:'serverKey', senderId:'senderId'}, function(err, data) {
      assert.equal(err, null);
      return cb();
    });
  },
  "test fhc variant delete": function(cb) {
    variantCmd.delete({app:'2a', name:'test', type:'android', id:'3a'}, function(err, data) {
      assert.equal(err, null);
      return cb();
    });
  }
};