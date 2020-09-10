const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Currency = mongoose.Types.Currency;

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
    type: Currency,
    required: true,
  },
});

var Books = mongoose.model("Book", bookSchema);

module.exports = Books;
