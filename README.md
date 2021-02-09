# Francken Consumption Counter

[![Jest tests](https://github.com/professorfrancken/consumption-counter/workflows/Jest%20tests/badge.svg)](https://github.com/ProfessorFrancken/plus-one/actions?query=workflow%3A%22Jest+tests%22)
[![End-to-end tests](https://github.com/professorfrancken/consumption-counter/workflows/End-to-end%20tests/badge.svg)](https://github.com/ProfessorFrancken/plus-one/actions?query=workflow%3A%22End-to-end+tests%22)
[![Coverage Status](https://coveralls.io/repos/github/ProfessorFrancken/Consumption-Counter/badge.svg)](https://coveralls.io/github/ProfessorFrancken/Consumption-Counter)

# Introduction

The consumption counter is used by T.F.V. 'Professor Francken' to keep track of food & drink purchases of its members.

The application has been boostrapped using [Create React
App](https://github.com/facebookincubator/create-react-app) and uses an external
API for retrieving its data.

To setup the application first install its dependencies using
[npm](https://www.npmjs.com/get-npm),

```sh
npm install
```

Next check if all the test pass,

```sh
npm run test
```

And if successful run the app,

```sh
npm run start
```

This will open the application in a new browser window located at
https://localhost:3000.

## Running cypress

We use [cypress](https://www.cypress.io/) for our end-to-end tests.
These tests will be run using Github actions, but can also be run locally by
calling,

```sh
npm run cypress
```

**Note**: before running this command make sure that you've started the
application by running `npm run start`.

This will open a user interface listing all of our integration tests, which you
can run by clicking "Run all specs".

## Using an alternative (persisting) server

By default we use [miragejs](http://miragejs.com/) to develop and test the
application.
This means that each time you start the application a new in-memory database is
initialized.

### TODO Discuss all API endpoints

The Consumtion Counter requires the following endpoints

#### POST /authenticate

#### POST /orders

#### GET /members

#### GET /products

#### GET /committees

#### GET /boards

#### GET /statistics/categories

#### GET /statistics/activities

## Using docker

If you don't want to install npm locally you can use docker instead to install
and run the application,

```
# First install dependencies
docker-compose run --rm node npm install

# Check if all unit tests pass
docker-compose run --rm node npm test

# Start the node server at port 30000
docker-compose up
```
