# Key_Ring
A contact maanger web app made using js

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)

## Introduction

This project is a backend API built with Node.js and Express. It provides a set of RESTful endpoints for managing resources and handling various operations. The purpose of this project is to serve as a robust and scalable backend solution for web and mobile applications.

## Features

- RESTful API structure
- CRUD operations for various resources
- User authentication and authorization
- Input validation
- Error handling
- Logging
- Environment-based configuration
- Testing with Jest and Supertest

## Technologies

- Node.js
- Express
- MongoDB (with Mongoose)
- JWT for authentication
- dotenv for environment configuration
- Express-validator for input validation
- Jest for testing
- Supertest for testing API endpoints


## Installation

### Prerequisites

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
- MongoDB account

### Setup

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

## Usage

To start the server in development mode, run:

```sh
npm run dev
```

The server will start at `http://localhost:3000`.

## Testing

The project has been tested across various levels, including unit tests and integration tests and finally end-to-end tests. The tests are written using the Jest testing framework. Supertest has also been used to test the API endpoints. 

The tests are located in the `./src/__tests__` directory.

To run the tests, use:

```sh
npm run test
```
