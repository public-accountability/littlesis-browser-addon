# littlesis-browser-addon

## developer install

- make sure you are using an up-to-date version of Chrome
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


### how to update the addon on the chrome store

1) update the version number in `manifest.json `

2) create a new zip file: ` make zip `

3) login to the [chrome websote developer dashboard](https://chrome.google.com/webstore/developer/dashboard)

4) click "edit" and then "upload updated package"

5) upload the zip file you generated in step 2

6) click "publish changes" at the bottom of the form

