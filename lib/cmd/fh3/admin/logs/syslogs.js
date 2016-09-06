/* globals i18n */
var common = require('../../../../common.js');
var _ = require('underscore');

module.exports = {
  'desc': i18n._('Search for log entries associated with a request ID. This requires aggregated logging to be enabled.'),
  'examples': [{
    cmd: 'fhc admin syslogs --requestId="07401646-b55e-4b9f-a181-c42f2fcbfd17" --projects="core,mbaas"',
    desc: i18n._('Searching for log entries associated with request ID: 07401646-b55e-4b9f-a181-c42f2fcbfd17')
  }],
  'demand': ['requestId', 'projects'],
  'describe': {
    'requestId': i18n._("A request ID to search for."),
    'projects': i18n._("A comma-separated list of project names to search for logs in."),
    'numLogEntries': i18n._("The maximum number of log entries returned. Default is 1000."),
    'orderBy': i18n._("The order of entries, by timestamp, to be displayed. The available options are 'first' or 'last'")
  },
  'orderingParams': {
    'first': 'asc',
    'last': 'desc'
  },
  'perm': 'cluster/reseller:read',
  'url': "/api/v2/logs/syslogs",
  'method': 'post',
  'preCmd': function (params, cb) {
    var projects = params.projects.split(',');
    params.orderBy = params.orderBy || "first";
    params.order = this.orderingParams[params.orderBy];


    if(!params.order) {
      return cb(new Error(i18n._("orderBy can either be 'first' or 'last'")));
    }

    //Creating indexes from the project names.
    //See https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-1-5.html#api-search-1-5
    projects = _.map(projects, function (projectName) {
      return projectName + ".*";
    });

    projects = projects.join(',');

    //Creating a search query for elasticsearch
    var searchParams = {
      index: projects,
      size: params.numLogEntries || 1000,
      body: {
        query: {
          filtered: {
            query: {
              match: {
                reqId: {
                  query: params.requestId,
                  //The query should match all parts of the request ID
                  operator: 'and'
                }
              }
            }
          }
        },
        //Most recent first.
        sort: {
          "time": {
            "order": params.order
          }
        }
      }
    };

    return cb(null, searchParams);
  },
  'postCmd': function(searchResults, cb) {
    searchResults._table = common.createTableForSyslogs(searchResults);

    return cb(null, searchResults);
  }
};
