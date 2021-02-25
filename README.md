# Learner's Block Library

This code and repository provides for https://library.learnersblock.org. 



# Development

## Install the dependencies
yarn

### Start the app in development mode (hot-code reloading, error reporting, etc.)
quasar dev

### Lint the files
yarn run lint

### Build the app for production
quasar build

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

### Add Languages
To add languages for i18n, go src/layouts/MainLayout, add the language to const languages and name it. Then go to src/i18n and mimic all the files and content from en-US folder. Then go to src/i18n/index.ts and add the import to the file created there.
