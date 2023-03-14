# cy-download ![tests](https://github.com/elaichenkov/cy-downloads/actions/workflows/blank.yml/badge.svg)

<div align="center">
<p>Cypress custom command to wait, make sure the file has been downloaded and clean up the download folder. Project based on cy-verify-download by Yevhen Laichenkov elaichenkov@gmail.com.</p>
</div>

## Installation

```shell
git clone https://github.com/paulosfjunior/cy-download.git
```

## Copy project

Copy folder `src` and file `package.json` for `<project>/cypress/support/utils/cy-download`.

## Extend Cypress command

This package extends Cypress' `cy` command.

**For Cypress v10+:**

Add this line to your project's `cypress/support/e2e.js`:

```javascript
require('cy-download').addCustomCommand();
```

Then you need to add the following lines of code to your project's `cypress.config.js`:

```javascript
const { downloadTasks } = require('cy-download');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', downloadTasks);
    },
  },
});
```

**For Cypress v9:**

So, you need to add this line to your project's `cypress/support/commands.js`:

```javascript
require('cy-download').addCustomCommand();
```

And add the following lines to your project's `cypress/plugins/index.js`:

```javascript
const { downloadTasks } = require('cy-download');

module.exports = (on, config) => {
  on('task', downloadTasks)
}
```

## Usage

Then, in your test, you can use it like this to verify the download:

```javascript
cy.verifyDownload('picture.png');

// or increase timeout
cy.verifyDownload('archive.zip', { timeout: 25000 });

// or increase timeout and interval pooling
cy.verifyDownload('archive.zip', { timeout: 25000, interval: 600 });

// check download if it contains file extension or partial file name
cy.verifyDownload('.png', { contains: true });
cy.verifyDownload('pic', { contains: true });

// check download if it does not contain file extension or partial file name
cy.verifyDownload('.png', { notContains: true });
cy.verifyDownload('pic', { notContains: true });

// if send parameters cotains and notcontains, it is considerate only contains
```

or use in your test, you can use it like this for clear download folder

```javascript
// clean folder download of cypress
cy.clearDownload();

// clean download by file name and extension
cy.clearDownload({ filename: 'picture.png', contains: false });

// clean download if it contains file extension or partial file name
cy.clearDownload({ filename: '.png'});
cy.clearDownload({ filename: 'pic'});

// clean download if it does not contain file extension or partial file name
cy.clearDownload({ filename: '.png', notContains: true });
cy.clearDownload({ filename: 'pic', notContains: true });

// if send parameters cotains and notcontains, it is considerate only contains
```

## Types

To enable IntelliSense information and autocomplete you have to include types in the `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "types": ["cypress", "cy-download"]
  }
}
```

## Author

Paulo Freitas <paulosfjunior@gmail.com>

## License

[MIT](LICENSE)
