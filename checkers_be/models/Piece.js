const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pieceSchema = new Schema({
  pieceColor: {
    type: String,
  },
  pieceNumber: {
    type: Number,
  },
  index: {
    type: Number,
  },
  isAlive: {
    type: Boolean,
  },
  pieceDirection: {
    type: String,
  },
  pieceType: {
    type: String,
  },
  leftDimension: {
    type: Number,
  },
  topDimension: {
    type: Number,
  },
});

const Piece = mongoose.model("Piece", pieceSchema);
module.exports = Piece;
