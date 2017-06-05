module.exports = { 
  'Google.com example test': function(browser) {
    browser
      .url('https://google.com')
      .waitForElementVisible('body', 3000)
      .assert.title('Google')
      .saveScreenshot('google.png')
      .end();
  }
};
