Employee Performance System

A full-stack Employee Performance Management System built with React, Node.js, GraphQL, and MongoDB.
The project follows a clean frontend–backend separation and uses JWT authentication for secure access.

Tech Stack-
Frontend-
React (Vite)
Apollo Client
GraphQL
HTML, CSS, JavaScript

Backend-
Node.js
Express.js
Apollo Server (GraphQL)
MongoDB (Mongoose)
JWT Authentication

Features-
User login with JWT authentication
Role-based access (EMPLOYEE / ADMIN)
Secure GraphQL APIs
Centralized Apollo Client setup
Clean and modular folder structure
Environment-based configuration

Project Structure-
employee-performance-system
│
├── backend
│   ├── src
│   │   ├── config
│   │   │   └── db.js
│   │   ├── graphql
│   │   │   ├── typeDefs.js
│   │   │   └── resolvers.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── apollo
│   │   │   └── client.jsx
│   │   ├── pages
│   │   │   └── Login.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md

Environment Variables-
Backend (backend/.env)-
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Frontend (frontend/.env)-
VITE_API_URI=http://localhost:5000/graphql
