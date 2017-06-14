const config = require('../nightwatch.conf.js');

module.exports = {
  
  'layout test': function(browser) {
    browser
      .url(`chrome-extension://${browser.globals.extensionId}/index.html`)
      .waitForElementVisible('body', 3000)
      .waitForElementPresent('h2', 1000)
      .assert.containsText('h2', 'Add a relationship')
      .assert.attributeEquals('#new-relationship-btn', 'disabled', 'true')
      .end();
  },
  
  'is_current': function(browser) {
    browser
      .url(`chrome-extension://${browser.globals.extensionId}/index.html`)
      .waitForElementVisible('body', 3000)
      .assert.elementPresent('div#is-current-radio-buttons')
    // 'unknown' is checked by default:
      .assert.attributeEquals('input#is_current_null', 'checked', 'true')
      .end();
  }
};

