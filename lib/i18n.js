module.exports = function() {
  var osLocale = require('os-locale');
  var Gettext = require('node-gettext');
  var fs = require('fs');
  var path = require('path');

  var ll_cc = osLocale.sync();
  var ll = ll_cc.split('_')[0];
  var ll_cc_po = path.join(__dirname, '../po/') + ll_cc + '.po';
  var ll_po = path.join(__dirname, '../po/') + ll + '.po';
  var file = [ll_cc_po, ll_po];
  var lang = [ll_cc, ll];
  var readPO = function() {
    try {
      return fs.readFileSync(file[0]);
    } catch(e) {
      if (file.length > 1) {
        lang.shift();
        file.shift();
        return readPO();
      }
      return null;
    }
  };
  var contents = readPO();
  var gt = new Gettext();

  gt.addTextdomain(lang[0], contents);
  gt._ = gt.gettext;
  gt.N_ = function(s) {
    return s;
  };

  return gt;
};
