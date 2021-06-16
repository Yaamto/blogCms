const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PriceSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    price : {
        type : Number,
        required : true,
      
    },
    details : {

        type : [String],
        required : true
    }


});

module.exports = {Price: mongoose.model('price', PriceSchema )};