const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lobbySchema = new Schema({
  gameState: {
    type: Schema.Types.ObjectId,
  },
  roomId: {
    type: String,
  },
  participant: {
    type: Number,
  },
  gameHasStarted: {
    type: String,
  },
});

const Lobby = mongoose.model("Lobby", lobbySchema);
module.exports = Lobby;
