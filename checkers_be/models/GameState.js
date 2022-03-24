const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameStateSchema = new Schema({
  allPiece: {
    type: [Schema.Types.ObjectId],
  },
  allBoxes: {
    type: [Schema.Types.ObjectId],
  },
  clickedBox: {
    type: Schema.Types.ObjectId,
  },
  clickedPiece: {
    type: Schema.Types.ObjectId,
  },
  pieceThatMadeLastKill: {
    type: Schema.Types.ObjectId,
  },
  pieceThatMovedLast: {
    type: Schema.Types.ObjectId,
  },
  piecesThatMustKill: {
    type: [Schema.Types.ObjectId],
  },
  isKillMove: {
    type: Boolean,
  },
  moveMade: {
    type: Boolean,
  },
  turn: {
    type: String,
  },
});

const GameState = mongoose.model("GameState", gameStateSchema);
module.exports = GameState;
