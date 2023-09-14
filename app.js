const express = require('express');
const db = require("./pkg/db/index");
const playerHandler = require("./handlers/playerHandler");
const gamesHandler = require("./handlers/gamesHandler");
const { uploadGamePhoto } = require("./handlers/gamesHandler");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.init();

app.get("/games/search", gamesHandler.search);
app.get("/games", gamesHandler.getAll);
app.get("/paginated-games",gamesHandler.getPaginated)
app.get("/games/:id", gamesHandler.getOne);
app.post("/games", uploadGamePhoto, gamesHandler.create);
app.patch("/game/:id", uploadGamePhoto, gamesHandler.update);
app.delete("/game/:id", gamesHandler.delete);

app.get("/players/:playerId/games", gamesHandler.listGamesPlayedByPlayer);

app.get("/players/search", playerHandler.search);
app.get("/players", playerHandler.getAll);
app.get("/paginated-players", playerHandler.getPaginated);
app.get("/players/:id", playerHandler.getOne);
app.post("/players", playerHandler.create);
app.patch("/player/:id", playerHandler.update);
app.delete("/player/:id", playerHandler.delete);

async function setupApp(_port) {
  await db.init(); // Wait for the database connection to be established
  
  const port =  _port;
  return new Promise((resolve, reject) => {
    const server = app.listen(port, (err) => {
      if (err) {
        console.error("Couldn't start the server");
        reject(err);
      }
      console.log(`Service started successfully on port ${port}`);
      resolve(server);
    });
  });
}
    setupApp(process.env.PORT);

    module.exports = {
      app,
      setupApp
    };
