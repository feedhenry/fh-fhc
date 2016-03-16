var output = require("./output");
var errorHandler = require("./error-handler");

var handler = {
  printCommandResult: function (err, data, conf, cmd) {
    if (err) return errorHandler(err);
    if (data === undefined) {
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
    if (!conf.json && conf.table && (cmd && cmd.table || (data && data._table))) {
      this.printAsTable(cmd,data);
    } else {
      if (data) {
        delete data._table;
      }
      //TODO simplyfy this code. Introduce one standard for formatting to json/table and plain messages.
      if (!conf.json && cmd && cmd.message) {
        output.write(cmd.message, errorHandler);
      } else {
        if (typeof data === 'string') return output.write(data, errorHandler);
        if (conf.filter) {
          var script = "output.write(data." + conf.filter + ", errorHandler)";
          eval(script);
        } else {
          return output.write(data, errorHandler);
        }
      }
    }
  },
  printAsTable:function(cmd,data){
    if (cmd && cmd.message) console.log(cmd.message);
    var table = cmd.table || data._table;
    console.log(table.toString());
    output.write("", errorHandler);
  }
}

module.exports = handler;