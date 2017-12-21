const assert = require('assert');

module.exports = {
  'littlesis.js tests' : {

    before: function(browser) {
      browser
        .url(`localhost:8080/login`)
        .waitForElementVisible('body', 3000)
        .setValue('#user_email', 'user1@email.com')
        .setValue('#user_password', 'password')
        .click('input[type="submit"');
    },

    beforeEach: function(browser) {
      browser
        .url(`chrome-extension://${browser.globals.extensionId}/index.html`)
        .waitForElementVisible('body', 3000)
        .waitForElementVisible('#entity-1', 1000)
        .waitForElementVisible('#relationship', 1000)
        .waitForElementVisible('#source-name', 1000)
        .waitForElementVisible('#clear-btn', 1000)
        .click('#clear-btn');
    },

    after: function(browser) {
      browser
        .end();
    },

    'form clears when reset button is clicked': function(browser) {
		  browser
        .setValue('#entity-1', ['George', browser.keys.ENTER])
        .waitForElementVisible('.tt-menu.tt-open', 1000)
        .click('.entity-suggestion:nth-of-type(1)')
        .click('#relationship option[value="1"]')
        .setValue('#source-name', 'Source Name')
        .click('#clear-btn')
  			.assert.value('#entity-1', '')
        .assert.value('#relationship', '')
        .assert.value('#source-name', `chrome-extension://${browser.globals.extensionId}/index.html`);
  	},

    'selecting an entity from dropdown sets id and primary extension data': function(browser) {
      browser
        .setValue('#entity-1', ['George', browser.keys.ENTER])
        .waitForElementVisible('.tt-menu.tt-open', 1000)
        .click('.entity-suggestion:nth-of-type(1)')
        .assert.attributeEquals('#entity1-data', 'data-id', '28776')
        .assert.attributeEquals('#entity1-data', 'data-ext', 'Person');    
    },

    'form repopulates with saved work when opened': function(browser) {
      browser
        .setValue('#entity-1', 'hello world')
        .url(`http://google.com`)
        .url(`chrome-extension://${browser.globals.extensionId}/index.html`)
        .waitForElementVisible('#entity-1', 3000)
        .assert.value('#entity-1', 'hello world');
    },

    'entity values are swapped when swap entities button is clicked': function(browser) {
      var fillEntities = function(browser) {
        browser
          .setValue('#entity-1', ['George', browser.keys.ENTER])
          .waitForElementVisible('#entity-1 ~ .tt-menu.tt-open', 1000)
          .click('#entity-1 ~ .tt-menu .entity-suggestion:nth-of-type(1)')

          .setValue('#entity-2', ['Berni', browser.keys.ENTER])
          .waitForElementVisible('#entity-2 ~ .tt-menu.tt-open', 1000)
          .click('#entity-2 ~ .tt-menu .entity-suggestion:nth-of-type(1)')

          .setValue('#description-1', 'first person')
          .setValue('#description-2', 'second person');
      };

      fillEntities(browser);
      browser
        .getValue('#entity-1', function(result1) {
          this.entity1Value = result1.value;
          this.getValue('#entity-2', function(result2) {
            this.entity2Value = result2.value;
              this.click('#swap-entities-btn', function() {
                this.assert.value('#entity-1', this.entity2Value);
                this.assert.value('#entity-2', this.entity1Value);
            })
          });
        });

      browser
        .assert.value('#description-1', 'second person')
        .assert.value('#description-2', 'first person')
        .click('#clear-btn');      
    },

    // 'set current tab button populates source name and url fields with info from open browser tab': function(browser) {
    //   browser
    //     .setValue('#source-name', 'Source Name')
    //     .setValue('#source-url', 'http://www.google.com')
    //     .click('#set-current-tab-btn')
    //     .assert.value('#source-name', `chrome-extension://${browser.globals.extensionId}/index.html`)
    //     .assert.value('#source-url', `chrome-extension://${browser.globals.extensionId}/index.html`);    
    // },

    'clicking create new entity button opens new entity form': function(browser) {
      
    },

    'clicking add to Littlesis button creates new relationship': function(browser) {

    }
  }
};
