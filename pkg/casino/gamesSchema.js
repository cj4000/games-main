const mongoose = require("mongoose");

const gamesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  image: [String]
});

const Games = mongoose.model("Games", gamesSchema);

module.exports = Games;
