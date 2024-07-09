# Key_Ring
A contact manager web app made using js

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)

## Introduction

This project is a backend API built with Node.js and Express. It provides a set of RESTful endpoints for managing resources and handling various operations. The purpose of this project is to serve as a robust and scalable backend solution for web and mobile applications. The API includes features such as user authentication, input validation, error handling, logging, and testing. It is designed to be easily extensible and customizable to fit the needs of different projects. The project has been containerized using Docker and can be deployed to various cloud platforms. Both development and production environments are supported, with environment-based configuration for easy setup and deployment is done using docker swarm.

## Features

- RESTful API structure
- CRUD operations for various resources
- User authentication and authorization
- Input validation
- Error handling
- Logging
- Environment-based configuration
- Testing with Jest and Supertest
- Docker containerization

## Technologies

- Node.js
- Express
- MongoDB (with Mongoose)
- JWT for authentication
- dotenv for environment configuration
- Express-validator for input validation
- Jest for testing
- Supertest for testing API endpoints
- Docker for containerization


## Installation

### Without Docker

#### Prerequisites

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
- MongoDB account

#### Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/lordgrim18/Key_Ring.git
    ```

2. Navigate to the project directory:

    ```sh
    cd Key_Ring
    ```

3. Install the dependencies:

    ```sh
    npm install
    ```

4. Create a `.env` file in the root directory and add the following environment variables:

    ```env
    PORT=3000
    CONNECTION_STRING=your_mongodb_uri
    ACCESS_TOKEN_SECRET=your_jwt_secret
    ```

#### Usage

To start the server in development mode, run:

```sh
npm run dev
```

The server will start at `http://localhost:3000`.


### With Docker

#### Prerequisites

- Docker
- Docker Compose

#### Setup

1. Clone the repository:

    ```sh
    git clone
    ```
2. Navigate to the project directory:

    ```sh
    cd Key_Ring
    ```

3. Create a `.env` file in the root directory and add the following environment variables:

    ```env
    PORT=3000
    CONNECTION_STRING=your_mongodb_uri
    ACCESS_TOKEN_SECRET=your_jwt_secret
    MONGO_INITDB_ROOT_USERNAME=root
    MONGO_INITDB_ROOT_PASSWORD=example
    ```
#### Usage

 Start the Docker container:

    ```sh
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
    ```

The server will start at `http://localhost:3000`.

## Testing

The project has been tested across various levels, including unit tests and integration tests and finally end-to-end tests. The tests are written using the Jest testing framework. Supertest has also been used to test the API endpoints. 

The tests are located in the `./src/__tests__` directory.

Each level of testing can be run separately:

- Unit tests:

```sh
npm run test:unit
```

- Integration tests:

```sh
npm run test:integration
```

- End-to-end tests:

```sh
npm run test:e2e
```

To run all the tests, use:

```sh
npm run test
```
