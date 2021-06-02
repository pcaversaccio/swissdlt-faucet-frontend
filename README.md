# Swiss DLT Faucet Frontend
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version `12.0.2` and Node.js version `16.0.0`. Also, I make use via the CI/CD configuration `.gitlab-ci.yml` of [GitLab Pages](https://docs.gitlab.com/ee/user/project/pages/) and the Angular application is served [here](http://swissdlt.appswithlove.site/swissdlt-faucet-frontend).

## Development server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
Run `npm run build:dev` to build the project. The build artifacts will be stored in the `public/` directory.

## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Environment variables
I use the `[dotenv](https://www.npmjs.com/package/dotenv` npm package - which is a zero-dependency module that loads environment variables from a `.env` file into `process.env` -  in combination with a self-coded TypeScript script `setenv.ts` (located at `scripts/`) to load the environment variables for the development as well as the production environment. This is particularly important for loading the *Infura Project ID*. For the GitLab CI/CD, I configured a masked CI/CD variable ([Learn more](https://gitlab.appswithlove.net/help/ci/variables/README#mask-a-cicd-variable)).

## Angular hack due to upgrade of `webpack` package to version 5
Angular 12 has migrated to `webpack` v5 and made a bunch of other changes to it's build system. In order to successfully serve and build the application with the injected `web3.js` (the Ethereum JavaScript API), I implemented a little hack (based on painful hours of debugging):

First, I had to install the required dependencies using
```
npm install crypto-browserify stream-browserify assert stream-http https-browserify os-browserify

```
and then add the following lines to the `polyfills.ts` file:
```
 (window as any).global = window;
 import { Buffer } from 'buffer';
 global.Buffer = Buffer;
 global.process = {
    env: { DEBUG: undefined },
    version: '',
    nextTick: require('next-tick')
    } as any;
```
