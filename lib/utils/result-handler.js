var output = require("./output");
var errorHandler = require("./error-handler");

var handler = {
  printCommandResult: function (err, data, conf, cmd) {
    if (err) {
      return errorHandler(err);
    }
    if (!data) {
      output.write("", errorHandler);
    } else {
      // display data as returned if specified
      if (!conf.json && conf.bare && cmd.bare) {
        output.write(cmd.bare, errorHandler);
      } else {
        this.printFormatted(err, data, conf, cmd);
      }
    }
  },
  printFormatted: function (err, data, conf, cmd) {
    var tableExists = cmd && cmd.table || (data && data._table);
    if (!conf.json && conf.table && tableExists) {
      this.printAsTable(cmd, data);
    } else {
      if (data) {
        delete data._table;
      }
      //TODO Introduce one standard for formatting to json/table and plain messages.
      if (!conf.json && cmd && cmd.message) {
        return output.write(cmd.message, errorHandler);
      }
      if (typeof data === 'string' || !conf.filter) {
        return output.write(data, errorHandler);
      }
      return output.write(data[conf.filter], errorHandler);
    }
  },
  printAsTable:function(cmd,data){
    if (cmd && cmd.message) {
      console.log(cmd.message);
    }
    var table = cmd.table || data._table;
    console.log(table.toString());
    output.write("", errorHandler);
  }
};

module.exports = handler;