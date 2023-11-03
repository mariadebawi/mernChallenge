const mongoose = require('mongoose'); // Erase if already required

var addressSchema = new mongoose.Schema({
    label:{
        type:String,
        required:true,
        unique:true,
    },
    adress:{
        type:String,
        required:true,

    },
    postalCode:{
        type:Number,

    },
    city:{
        type:String,
        default:'Paris',
    },
    isDefault:{
        type:Boolean,
        default:false,
    },
    country:{
        type:String,
        default:'France',
    },
},

{ timestamps: true },);

//Export the model
module.exports = mongoose.model('Address', addressSchema);



