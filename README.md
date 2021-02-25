# Learner's Block Library

This code and repository provides for https://library.learnersblock.org. 

Contributions are welcome, please see the open issues and Good First Issues tag for guidance. 

# Backend

The backend for this site is served by Strapi. Please see the [template repository](https://github.com/LearnersBlock/library-backend-template) for details on building a development backend. 

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

### Bug reports

For bug reports, please search existing issues before posting a ticket. 

### Translation of the interface

We encourage translations and adjustments to current translations on all our components. These can be contributed via [Weblate](https://translate.learnersblock.org).  

### Donations

As with all community projects, we do incur costs. You can see everything we have spent, everything we have been donated and you can donate through our [funding page](https://docs.learnersblock.org/about-us#how-we-are-funded). 

## License

Learner’s Block is released under the [GPL-3.0 License](https://github.com/LearnersBlock/learners-block/blob/master/LICENSE)
