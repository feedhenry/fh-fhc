var nock = require('nock');
var data = require('./environments');

var searchParams = {
  "index": "core.*,mbaas.*",
  "size": 1000,
  "body": {
    "query": {
      "filtered": {
        "query": {
          "match": {
            "reqId": {
              "query": "somerequestidtosearch",
              "operator": "and"
            }
          }
        }
      }
    },
    "sort": {
      "time": {
        "order": "asc"
      }
    }
  }
};

//Mock response from the logs API
var searchResponse = {
  "took": 16,
  "timed_out": false,
  "_shards": {
    "total": 40,
    "successful": 40,
    "failed": 0
  },
  "hits": {
    "total": 1,
    "max_score": null,
    "hits": [
      {
        "_index": "core.a9a3c15a-701d-11e6-9edd-fa163e2365b6.2016.09.06",
        "_type": "fluentd",
        "_id": "AVb-3WpRlS9yXTAEKeAK",
        "_score": null,
        "_source": {
          "time": "2016-09-06T09:38:57.317Z",
          "name": "supercore",
          "hostname": "172.16.72.225",
          "pid": 1,
          "reqId": "somerequestidtosearch",
          "level": 50,
          "err": "Error reading environment 'doesnotexist\"",
          "req_method": "GET",
          "req_url": "/doesnotexist/appforms/forms",
          "req_worker": -1,
          "msg": "MbaaS Error",
          "v": 0,
          "docker_container_id": "a62cef5c5d21057fa6d48d313cca201c9a5a540ab7028677a039fa45a900ec58",
          "kubernetes_namespace_name": "core",
          "kubernetes_pod_id": "328fb2be-7388-11e6-9edd-fa163e2365b6",
          "kubernetes_pod_name": "fh-supercore-4-zql1d",
          "kubernetes_container_name": "fh-supercore",
          "kubernetes_labels_deployment": "fh-supercore-4",
          "kubernetes_labels_deploymentconfig": "fh-supercore",
          "kubernetes_labels_name": "fh-supercore",
          "kubernetes_host": "172.16.72.225",
          "kubernetes_namespace_id": "a9a3c15a-701d-11e6-9edd-fa163e2365b6",
          "message": null,
          "version": "1.2.0"
        },
        "sort": [
          1473154737317
        ]
      }
    ]
  }
};


module.exports = nock('https://apps.feedhenry.com')
  .post('/api/v2/logs/syslogs', searchParams).reply(200, searchResponse);