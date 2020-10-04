const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let invoiceSchema = new Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: Number,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
  customerPincode: {
    type: String,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  invoiceDate: {
    type: String,
    required: true,
  },
  sellingPlatform: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "confirmed",
  },
  invoiceItems: [
    {
      name: {
        type: String,
        required: true,
      },
      sku_Id: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      costPrice: {
        type: Number,
        required: true,
      },
      sellingPrice: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      discountedPrice: {
        type: Number,
        required: true,
      },
      publisher: {
        type: String,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
});

var Invoices = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoices;
