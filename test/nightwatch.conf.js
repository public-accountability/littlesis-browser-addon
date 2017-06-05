/**
   you can customize these two environment variables before running the tests:
     - LS_BROWSER_EXTENSION_PATH
     - LS_BROWSER_EXTENSION_ID
 */

const extensionPath = process.env.LS_BROWSER_EXTENSION_PATH ? process.env.LS_BROWSER_EXTENSION_PATH : __filename.replace('/test/nightwatch.conf.js', '');
const extensionId =  process.env.LS_BROWSER_EXTENSION_ID ?  process.env.LS_BROWSER_EXTENSION_ID : "ghojplmkpcileoeodppmgmnkgkedolog";

module.exports = (function(settings) {
  settings.test_settings.default.globals.extensionId = extensionId;
  settings.test_settings.default.desiredCapabilities.chromeOptions.args.push(`--load-extension=${extensionPath}`);
  return settings;
})(require('./nightwatch.json'));
