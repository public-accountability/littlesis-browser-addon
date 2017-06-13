const assert = require('assert');

module.exports = {
  
  'is current test': function(browser) {
    browser
      .url(`chrome-extension://${browser.globals.extensionId}/index.html`)
      .waitForElementVisible('body', 1000)
      .execute(function(){
	return isCurrentSelection.value();
      }, [], function(result) {
	this.assert.equal(result.value, 'NULL');
      })
      .click('#is_current_yes')
      .execute(function(){
	return isCurrentSelection.value();
      }, [], function(result) {
	this.assert.equal(result.value, 'yes');
      })
      .assert.attributeEquals('#is_current_yes', 'checked', 'true')
      .click('#is_current_no')
      .execute(function(){
	return isCurrentSelection.value();
      }, [], function(result) {
	this.assert.equal(result.value, 'no');
      })
      .assert.attributeEquals('#is_current_no', 'checked', 'true')
      .execute(function(){
	return isCurrentSelection.reset();
      }, [])
      .assert.attributeEquals('input#is_current_null', 'checked', 'true')
      .end();
  }

};

