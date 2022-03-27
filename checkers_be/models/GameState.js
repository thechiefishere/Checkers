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
  piecesThatMustKill: [
    {
      type: Schema.Types.Mixed,
    },
  ],
  clickedBox: Schema.Types.Mixed,
  clickedPiece: Schema.Types.Mixed,
  pieceThatMadeLastKill: Schema.Types.Mixed,
  pieceThatMovedLast: Schema.Types.Mixed,
  isKillMove: Boolean,
  moveMade: Boolean,
  turn: String,
});

const GameState = mongoose.model("GameState", gameStateSchema);
module.exports = GameState;
