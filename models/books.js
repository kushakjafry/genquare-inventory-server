const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  stocks: {
    type: Number,
    required: true,
    default: 00,
  },
  skuId: {
    type: String,
    required: true,
    unique: true,
  },
  publisher: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 00,
  },
});

var Books = mongoose.model("Book", bookSchema);

module.exports = Books;
