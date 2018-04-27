var testServiceGuid = "someserviceguid";

module.exports = {
  get: function() {
    return {
      _id: "somedatasource",
      name: "Some Data Source",
      serviceGuid: testServiceGuid,
      refreshInterval: 1,
      description: "A Data Source",
      endpoint: "/someendpoint",
      numAuditLogEntries: 100
    };
  },
  apiResponse: function() {
    var ds = this.get();

    ds.service = {
      guid: ds.serviceGuid,
      title: "Test Service"
    };

    return ds;
  },
  withData: function() {
    var ds = this.apiResponse();

    ds.currentStatus = {
      status: "ok"
    };
    ds.data = this.dsDataSet();

    return ds;
  },
  withValidationResultValid: function() {
    var ds = this.apiResponse();

    ds.validationResult = {
      valid: true,
      message: "Data Source Is Valid"
    };
    ds.data = this.dsDataSet();

    return ds;
  },
  withValidationResultInvalid: function() {
    var ds = this.apiResponse();

    ds.validationResult = {
      valid: false,
      message: "Data Source Is Invalid"
    };
    ds.data = this.dsDataSet();

    return ds;
  },
  dsDataSet: function() {
    return [{
      key: "dskey1",
      value: "DS Value 1",
      selected: false
    },{
      key: "dskey2",
      value: "DS Value 2",
      selected: true
    }];
  },
  withAuditLogs: function() {
    var data = this.withData();
    data.auditLogs =  [{
      updateTimestamp: new Date(),
      serviceGuid: testServiceGuid,
      endpoint: ds.endpoint,
      lastRefreshed: new Date(),
      data: self.dsDataSet(),
      dataHash: "123456",
      currentStatus: {
        status: "ok"
      }
    }];
    return data;
  },
  withError: function() {
    var ds = this.apiResponse();

    ds.currentStatus = {
      status: "error",
      error: {
        code: "DS_ERROR",
        userDetail: "Data Source Error",
        systemDetail: "Data Source System Data"
      }
    };

    return ds;
  }
};