var nock = require('nock');
var data =
  [
    {
      clientAppName:null,
      cloudAppName:null,
      environment:'dev',
      tag:'0.0.3',
      destination:'android',
      domain:'support',
      status:'ACTIVE',
      statusText:'',
      cloudApp:'gz6uwsbeqfpp5fpddw426ns2',
      clientApp:'gz6uwsbecxi3xusncagc5o25',
      project:'gz6uwsg7peooxyslv7aqglry',
      build:'ji5s7opcnzcf37bgtnm2xxai',
      businessObject:'cluster/reseller/customer/domain/project/connection',
      clientVersion:0,
      guid:'3zjasql3lparv4jfx7waxh4e',
      sysOwner:'3pbuu45gn3ynj2r5fu5bynhu',
      sysVersion:1,
      sysModified:1495715084504,
      sysCreated:1495715036698,
      sysGroupFlags:65567,
      sysGroupList:''
    }
  ];
module.exports = nock('https://apps.feedhenry.com')
  .filteringRequestBody(function() {
    return '*';
  })
  .get('/box/api/projects/gz6uwsg7peooxyslv7aqglry/connections', '*')
  .reply(200, data)
  .put('/box/api/connections/', '*')
  .reply(200, data);
