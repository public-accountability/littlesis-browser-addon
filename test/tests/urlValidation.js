module.exports = {
  
  'URL Validation test': function(browser) {
    browser
      .url(`chrome-extension://${browser.globals.extensionId}/index.html`)
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('label[for=source-url]')
      .assert.elementPresent('#source-url-message-icon')
      .clearValue('#source-url')
      .setValue('#source-url', 'https://littlesis.org')
      .assert.cssClassPresent('#source-url-message-icon', 'valid')
      .assert.cssClassNotPresent('#source-url-message-icon', 'invalid')
      .clearValue('#source-url')
      .setValue('#source-url', 'chrome://extensions')
      .assert.cssClassPresent('#source-url-message-icon', 'invalid')
      .assert.cssClassNotPresent('#source-url-message-icon', 'valid')
      .end();
  }
  
};

