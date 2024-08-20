# Jenius: Technical Test

## Description
This project implements a Node.js microservices architecture using Express for CRUD operations. The data is stored in MongoDB, and the application includes JWT-based authentication. The project also integrates with Redis for caching.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Environment Variables](#environment-variables)
- [Sample User Credentials](#sample-user-credentials)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [JWT Authentication](#jwt-authentication)
- [Caching with Redis](#caching-with-redis)
- [Unit Testing](#unit-testing)
- [Postman Collection](#postman-collection)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: v20
- **npm**: v10
- **MongoDB**: Installed and running locally or on a remote server
- **Redis**: Installed and running locally or on a remote server
- **Postman**: Installed for API testing

## Project Setup

### 1. Clone the Repository

```bash
git https://github.com/Fadhilamadan/ms-fadhilamadan-betest.git
cd ms-fadhilamadan-betest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory of the project and configure the following environment variables:

```env
# Application configuration
PORT=3000

# JWT configuration
JWT_SECRET=your_jwt_secret_key
JWT_DURATION=your_jwt_duration

# Redis configuration
REDIS_PORT=localhost
REDIS_HOST=6379
REDIS_PASSWORD=password

# MongoDB configuration
MONGO_URI=mongodb://localhost:27017/your_database_name
```

Ensure that they are correctly set according to your environment.

## Sample User Credentials

For convenience, the following sample user credentials are provided. You can use these to log in and test the application's authentication and user management features.

- **Username**: `fadhilamadan`
- **Password**: `password`

These credentials are pre-populated in the database. You can use them directly to generate a JWT token via the login API.

## Running the Application

### 1. Start the Application

To start the application in development mode:

```bash
npm run dev
```

This command will start the application using `nodemon`, a tool that automatically reloads the server when code changes are detected. If you don't already have `nodemon` installed globally, you can install it by running `npm install -g nodemon`.

### 2. Accessing the APIs

The application will be available at `http://localhost:3000/api`. You can use Postman or any other API client to interact with the endpoints.

## API Endpoints (sample)

### 1. Account Login

- **POST** `/api/account/login`
  - Request Body:
    ```json
    {
      "userName": "fadhilamadan",
      "password": "password"
    }
    ```
  - Response:
    ```json
    {
      "token": "JWT Token"
    }
    ```

### 2. User Info

- **GET** `/api/user/accountNumber/:accountNumber`
  - Request Header: `Authorization: Bearer <JWT Token>`
  - Response:
    ```json
    {
      "userId": "string",
      "fullName": "string",
      "accountNumber": "string",
      "emailAddress": "string",
      "registrationNumber": "string"
    }
    ```
    
- **GET** `/api/user/registrationNumber/:registrationNumber`
  - Request Header: `Authorization: Bearer <JWT Token>`
  - Response:
    ```json
    {
      "userId": "string",
      "fullName": "string",
      "accountNumber": "string",
      "emailAddress": "string",
      "registrationNumber": "string"
    }
    ```

### 3. JWT Authentication

- API endpoints are protected using JWT authentication. You must include a valid JWT token in the `Authorization` header of your requests.

## JWT Authentication

### 1. Generating a JWT Token

To generate a JWT token, send a `POST` request to the `/api/account/login` endpoint with the user’s credentials. The server will respond with a JWT token if the credentials are valid.

### 2. Using the JWT Token

Include the JWT token in the `Authorization` header of your requests:

```http
Authorization: Bearer <JWT Token>
```

## Caching with Redis

### 1. Setting Cache

The application caches user information in Redis. When fetching user data by `accountNumber` or `registrationNumber`, the application first checks the Redis cache before querying MongoDB.

### 2. Configuration

Ensure Redis is running and configured correctly in the `.env` file.

## Unit Testing

### 1. Running Unit Tests

The project includes unit tests to verify the functionality of the application. You can run the tests using:

```bash
npm run test
```

This command will execute all the tests using Jest.

## Postman Collection

To test the API endpoints:

1. **Access the Postman Collection**: [Click here to open the collection](https://documenter.getpostman.com/view/6043175/2sA3sAfmdX).
2. **Set Environment**: Set the `url` to your API (e.g., `https://ms-fadhilamadan-betest.vercel.app/api`) and add your `token` after logging in.
3. **Send Requests**: Use the predefined requests in the collection to interact with the API.
