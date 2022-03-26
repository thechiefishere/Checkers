const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameStateSchema = new Schema({
  allPiece: [
    {
      type: Schema.Types.Mixed,
    },
  ],
  allBoxes: [
    {
      type: Schema.Types.Mixed,
    },
  ],
  clickedBox: {
    type: Schema.Types.Mixed,
  },
  clickedPiece: {
    type: Schema.Types.Mixed,
  },
  pieceThatMadeLastKill: {
    type: Schema.Types.Mixed,
  },
  pieceThatMovedLast: {
    type: Schema.Types.Mixed,
  },
  piecesThatMustKill: [
    {
      type: Schema.Types.Mixed,
    },
  ],
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
