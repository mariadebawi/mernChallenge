const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // delete white espace
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory' ,
      required: true,
    },
    brand:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brands' ,
        required : true,

    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
      select :false //show in get
    },
    images :{
        type: Array,
    },
    color:[ {
      type: mongoose.Schema.Types.ObjectId,
       ref: 'colors' ,
        required: true,
      }],

      rating : [{
        star : Number ,
        comment :String ,
        postedBy : {  type: mongoose.Schema.Types.ObjectId,  ref: "User",}
      }],

      totalrating: {
        type: String,
        default: 0,
      },
      publish:{
        type:Number ,
        default:1,
        enum:[0 , 1]
      }

  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);