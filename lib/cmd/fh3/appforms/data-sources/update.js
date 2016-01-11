var fhreq = require('../../../../utils/request.js');
var _ = require('underscore');
var common = require('../../../../common.js');

module.exports = {
  'desc': 'Update a data source.',
  'examples': [{cmd: 'fhc appforms data-sources update --id="dataSource123456" --name="New Data Source" --description="A Data Source" --refreshInterval=2 --serviceGuid="glaovni73qwjla5qt2oyocw3" --endpoint="/path/to/data"', desc: 'Update a data source.'}],
  'demand': ['id'],
  'alias': {},
  'describe': {
    'id': "ID Of The Data Source To Update",
    'name': "Name of the data source to create",
    'serviceGuid': "The ID of the service to associate with the data source",
    'endpoint': "A valid path to the endpoint to be polled for data",
    'refreshInterval': "The time, in minutes, between data polling",
    'description': "Description for the data source"
  },
  'preCmd': function(params, cb){
    //Getting the Data Source To See If It Exists
    fhreq.GET(undefined, '/api/v2/appforms/data_sources/' + params.id, function(err, dataSource) {
      if (err) {
        return cb(err);
      }

      params._id = params.id;
      //Overwriting Any Valid Parameters Passed By The User
      var updateData = _.mapObject(dataSource, function(value, key){
        return params[key] || value;
      });

      return cb(undefined, updateData);
    });
  },
  'url': function(updateData){
    return "/api/v2/appforms/data_sources/" + updateData._id;
  },
  'method': 'put',
  'postCmd': function(dataSource, cb){
    dataSource._table = common.createTableForDataSources(dataSource);
    cb(undefined, dataSource);
  }
};
