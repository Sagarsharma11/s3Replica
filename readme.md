# S3 Replica API

API for managing files and buckets, built with Node.js, Express, MongoDB, and JWT authentication.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [Testing Endpoints](#testing-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

This API provides endpoints to manage user buckets and upload/download files securely. It includes authentication via JWT tokens and CRUD operations for buckets and files.

## Prerequisites

Make sure you have the following installed:

- Node.js (v14 or higher recommended)
- MongoDB URI for database connection
- Postman (optional) for testing API endpoints

## Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd s3-replica-api

2. npm install

3. #environment-variables
    MONGODB_URI=
    PORT=8001
    JWT_SECRET=
4. Running the Server
    npm run dev

## Swagger UI
Access Swagger UI at http://localhost:8001/api-docs after starting the server. Make sure headers are correctly set, especially for uploading files.