const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  dateOfBirth: {
    type: Date,
  },
  games: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Games",
    },
  ],
});

const Player = mongoose.model("Player", PlayerSchema);

module.exports = Player;
