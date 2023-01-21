# Store front backend

## Introduction

This application is built by:

### Typescript

    As the programing language, with its configuration in ./tsconfig.json

### Express

    As the Endpoint manager

### MongoDB database

    As the javascript documental database

### Postgresql database

    As the sql relational database

### Sharp

    for resizing products images, before download and after upload

### Jasmine & Supertest

    For testing, notice the scripts for the tests, you have to:

#### SET ENV=test_pg_editor for authorized editor level

#### SET ENV=test_pg_user for signed in user level

#### SET ENV=test_pg for guest level(not signed in)

#### SET ENV=test_mongo_editor, replace "pg" with "mongo" to test the project against mongo database

#### for all tests to success, you have to use authorization levels [editor, admin, owner]

### Socket.io

    For customer service chat, but still under construction.

## Installation

#### Download the project to your local machine

#### open the project by Visual Studio Code, or any other

#### In the terminal, run 'npm install' or 'yarn install' to install all the libraries in the package.json

#### Download & install postgresql.exe, while installing enter the password to the main user "postgres"

#### In the terminal, type:

> > psql -d postgres -U
> >
> > password-entered-in-installation
> >
> > CREATE USER yourname WITH LOGIN PASSWORD 'password';
> >
> > ALTER USER yourname CREATEDB;
> >
> > \q
> >
> > psql -d postgres -U yourname
> >
> > password
> >
> > CREATE DATABASE store;
> >
> > CREATE DATABASE store_test;
> >
> > \q

now your databases are created, you can add an .env file with the following info.

> > PORT=5000
> >
> > PG_HOST=localhost
> >
> > PG_PORT=5432
> >
> > PG_DB=store
> >
> > PG_TEST_DB=store_test
> >
> > PG_USER=your-username
> >
> > PG_PASS=your-password

#### for mongodb database, sign in in mongodb.com, then create a new cluster, get the connection with your user-name & password as the follow, and add it to the .env file

> > MONGO_ClUSTER0=mongodb+srv://your-name:your-password@your-cluster-address.mongodb.net/?retryWrites=true&w=majority

#### in your .env file, add

> > JWT_SECRET=a-secret-password
> >
> > COOKIE_PARSER_SECRET=another-password
> >
> > FRONTEND_DEVELOPMENT=http://localhost:3000
> >
> > BACKEND_DEVELOPMENT=http://localhost:5000

#### in your .env file, use one of the following

> > ENV=dev_pg #to use postgres database
> >
> > ENV=dev_mongo #to use mongo database

#### In the terminal, run 'npm run build', to compile the typescript to javascript in /build folder

#### In the terminal, run 'npm run start' to start the project on localhost:5000

#### Start using the endpoints, as mentioned in requirements.md file.

#### "npm run test_pg_editor" to test postgres database as an editor, and avoid token authentication and authorization

#### "npm run test_mongo_editor" to test mongo database as an editor, and avoid token authentication and authorization
