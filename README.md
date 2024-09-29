# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. I have gained a deeper understanding of how to work with databases, set up security and testing, prepare for potential errors/invalid data input, and deploy web applications on a remote machine. My eventual goal is to create a server with an API and user authorization.

## Project Description

The server is built to handle various aspects of the WTWR application, such as storing and retrieving clothing items based on weather conditions, managing user data, and enabling user interactions like liking items. The goal is to create a reliable and secure API that the front-end can interact with to provide a seamless user experience.

## Technologies and Techniques Used

- **Node.js**: The server is built using Node.js, leveraging its asynchronous capabilities to handle multiple requests efficiently.
- **Express.js**: Used as the web application framework for building the API, allowing for quick and flexible route management.
- **MongoDB**: A NoSQL database is used for storing user and clothing item data, providing a scalable solution for managing collections of documents.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB, used to model the application data and provide a straightforward API for database operations.
- **JWT (JSON Web Tokens)**: Implemented for user authentication, ensuring that only authorized users can access or modify certain resources.
- **ESLint and Prettier**: Configured to maintain consistent code style and quality across the project.
- **GitHub Actions**: Used for continuous integration, automatically running tests and code style checks on each commit.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Deployed Application

[WTWR](https://www.wtwr.codemare.com)
