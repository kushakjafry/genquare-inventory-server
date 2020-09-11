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
    default: 01,
  },
  skuId: {
    type: String,
    required: true,
    unique: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    require: true,
  },
});

var Books = mongoose.model("Book", bookSchema);

module.exports = Books;
