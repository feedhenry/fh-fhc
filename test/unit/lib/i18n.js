var i18n = require('i18n.js')();
var assert = require('assert');

module.exports = {
  'test i18n module': function(done) {
    var testTranslations = {
      'Test': {'es': 'Prueba', 'ja': 'テスト', 'pt': 'Teste'}
    };
    Object.keys(testTranslations).forEach(function(k) {
      var d = testTranslations[k];
      Object.keys(d).forEach(function(kk) {
	var dd = d[kk];
	i18n.addTextdomain(kk);
	i18n.domains[i18n._normalizeDomain(kk)].translations[''] = {};
	i18n.domains[i18n._normalizeDomain(kk)].translations[''][k] = {msgstr: [dd]};
      });
    });
    i18n.textdomain('es');
    assert.equal(i18n._('Test'), 'Prueba');
    i18n.textdomain('ja');
    assert.equal(i18n._('Test'), 'テスト');
    i18n.textdomain('pt');
    assert.equal(i18n._('Test'), 'Teste');
    done();
  }
};
