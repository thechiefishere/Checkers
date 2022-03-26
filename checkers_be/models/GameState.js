const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameStateSchema = new Schema({
  allPiece: {
    type: [Schema.Types.ObjectId],
    ref: "Piece",
  },
  allBoxes: {
    type: [Schema.Types.ObjectId],
    ref: "Box",
  },
  clickedBox: {
    type: Schema.Types.ObjectId,
    ref: "Box",
  },
  clickedPiece: {
    type: Schema.Types.ObjectId,
    ref: "Piece",
  },
  pieceThatMadeLastKill: {
    type: Schema.Types.ObjectId,
    ref: "Piece",
  },
  pieceThatMovedLast: {
    type: Schema.Types.ObjectId,
    ref: "Piece",
  },
  piecesThatMustKill: {
    type: [Schema.Types.ObjectId],
    ref: "Piece",
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
