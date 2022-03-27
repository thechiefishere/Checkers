const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lobbySchema = new Schema({
  gameState: {
    type: Schema.Types.ObjectId,
    ref: "GameState",
  },
  roomId: String,
  participant: Number,
  gameHasStarted: String,
  gameType: String,
});

const Lobby = mongoose.model("Lobby", lobbySchema);
module.exports = Lobby;
