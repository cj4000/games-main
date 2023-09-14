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


app.listen(process.env.PORT, (err) => {
    if (err) {
      return console.log("Couldn't start the server");
    }
    console.log("Service started succesfully on port 3000");
  });
