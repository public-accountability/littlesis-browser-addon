const config = require('../nightwatch.conf.js');

module.exports = {
  'switching between relationship categories': {

    'selecting position relationships': function(browser) {
      browser
	.url(`chrome-extension://${browser.globals.extensionId}/index.html`)
	.waitForElementVisible('body', 3000)
	.click("#relationship option[value='1']")
	.assert.containsText("label[for='entity-1']", 'Entity 1')
	.assert.containsText("label[for='entity-2']", 'Entity 2')
        .end();
    },

    'selecting hierarchical relationships': function(browser) {
      browser
	.url(`chrome-extension://${browser.globals.extensionId}/index.html`)
	.waitForElementVisible('body', 3000)
	.assert.containsText("label[for='entity-1']", 'Entity 1')
	.assert.containsText("label[for='entity-2']", 'Entity 2')
	.click("#relationship option[value='11']")
	.assert.containsText("label[for='entity-1']", 'Child')
	.assert.containsText("label[for='entity-2']", 'Parent')
	.click("#relationship option[value='2']")
	.assert.containsText("label[for='entity-1']", 'Entity 1')
	.assert.containsText("label[for='entity-2']", 'Entity 2')
        .end();
    }
  }
};
