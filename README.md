# Softomate test project

### Installation

1. Download and install Node.js package from [Node.js official website](https://nodejs.org/en/)

2. Install yo, gulp and bower
```bash
npm install -g yo gulp-cli bower
```

3. Install generator-chrome-extension
```bash
npm install -g generator-chrome-extension
```

### Build project
1. Run `gulp build` for build, clean and minify source files
2. Bring up the Extensions management page by going to URL `chrome://extensions`
3. Ensure that the "Developer mode" checkbox in the top right-hand corner is checked
4. Click the Pack extension button
5. In the Extension root directory field, specify the path to the extension's folder
6. Click Package. The packager creates two files: a .crx file, which is the actual extension that can be installed, and a .pem file, which contains the private key.

***Do not lose the private key!*** Keep the .pem file secret and in a safe place. .pem file used to update extension or upload it to the Chrome Web Store
