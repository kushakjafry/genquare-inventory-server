const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    stocks:{
        type:Number,
        required:true
    },
    skuId:{
        type:String,
        required:true
    }
})

var Books = mongoose.model('Book',bookSchema);

module.exports = Books;