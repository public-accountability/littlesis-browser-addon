# littlesis-browser-addon

## developer install

- `git clone https://github.com/public-accountability/littlesis-browser-addon.git`
- in Chrome, navigate to "chrome://extensions/"
- click "Load unpacked extension..." and select the extension folder

### Testing setup

Requirements: nodejs, java

Install [nightwatch.js](http://nightwatchjs.org/):

``` bash
cd test && npm install
```

Download Selenium and ChromeDriver:

``` bash
cd test
npm run download-selenium
# if on linux:
npm run download-chromedriver
# if on mac:
npm run download-chromedriver-mac

```

Set environment variable *LS_BROWSER_EXTENSION_ID* to be the id of your installed version of the littlesis browser extension:

``` bash
export LS_BROWSER_EXTENSION_ID=[ABCXYZ...]
```

[ABCXYZ...] is the chrome extension id. Go to the chrome://extensions page, and look under the Littlesis Add-on for *ID*. 

Run the tests:

``` bash
cd test && npm test
```

