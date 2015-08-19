
module.exports = {
  'desc' : 'Deletes A Single Form. This will undeploy all forms from all environments.',
  'examples' : [{ cmd : 'fhc appforms forms delete --id=<ID Of Form To Delete>', desc : 'Deletes A Single Form.'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'ID Of The Form To Remove.'
  },
  'url' : function(params){
    return '/api/v2/appforms/forms/' + params.id;
  },
  'method' : 'delete'
};
