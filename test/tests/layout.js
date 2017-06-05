module.exports = {
  
  'layout test': function(browser) {
    browser
      .url('chrome-extension://ghojplmkpcileoeodppmgmnkgkedolog/index.html')
      .waitForElementVisible('body', 3000)
      .waitForElementPresent('h2', 1000)
      .assert.containsText('h2', 'Add a relationship')
      .assert.attributeEquals('#new-relationship-btn', 'disabled', 'true')
      .end();
  }
};

