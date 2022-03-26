const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boxSchema = new Schema({
  boxColor: {
    type: String,
  },
  boxNumber: {
    type: Number,
  },
  isFilled: {
    type: Boolean,
  },
  leftDimension: {
    type: Number,
  },
  topDimension: {
    type: Number,
  },
  piece: {
    type: Schema.Types.ObjectId,
    ref: "Piece",
  },
});

const Box = mongoose.model("Box", boxSchema);
module.exports = Box;
