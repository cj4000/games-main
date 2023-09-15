
## Casino Games and Players Management

This is a backend application for managing casino games and players via a REST API. It provides features for managing games and players, including CRUD operations, pagination, and search functionality.


## Features
#### Games Management:
- Create, Read, Update, and Delete (CRUD) operations for games.
- List all games with pagination support.
- Search for games by title or other attributes.
- Upload photos for games.

#### Players Management:
- Create, Read, Update, and Delete (CRUD) operations for players.
- List all players with pagination support.
- List games played by a specific player.
- Search for players by name or other attributes.

#### Swagger Documentation:

Swagger documentation is available to explore and understand the API endpoints.


## Getting Started

### Prerequisites
- Node.js and npm should be installed on your system.
- MongoDB should be installed and running.


### Installation

#### 1. Clone the repository to your local machine:
```bash
git clone <repository-url> 
```

#### 2. Change into the project directory:
```bash
cd casino-games-players-api
```
#### 3. Install the project dependencies:
```bash
npm install
```
#### 4. Set up your MongoDB
Set up your MongoDB connection by configuring the database URL in **config.env** file.

For example:
```bash
PORT=3000
DATABASE=mongodb+srv://jovanaconik:<PASSWORD>@cluster1.m4lazem.mongodb.net/?retryWrites=true&w=majority
DATABASE_PASSWORD=(put your password)
```
- ###### **<PASSWORD> must be in capital letters**


#### 5. Start the server:
```bash
npm start
```
The server will be running at http://localhost:3000.


## API Documentation

Explore and test the API endpoints using Swagger UI at http://localhost:3000/api-docs and Postman.

### Usage
- Use API endpoints to manage casino games and players.
- Refer to the code in the **app.js** file for detailed information on the available routes and request formats.
## Running Tests

To run tests, run the following command
```bash
  npm test
```

