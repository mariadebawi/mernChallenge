const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    isBlocked  : {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        default: [],
    },
    refreshToken: {
        type: String,

    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }] ,
    passwordChangedAt: Date ,
    passwordResetToken: String ,
    passwordResetExpires: Date ,
   },
    {
        timestamps: true
    })


// );

//trigger
userSchema.pre("save", async function (next) {
    if(!this.isModified('password')) {
      next()
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt)
})

//add Method "isPasswordMatched"
userSchema.methods.isPasswordMatched = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password)
}

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex") ;
  this.passwordResetExpires = Date.now() + 24 *60 * 60 *1000 // 24 H
  return resetToken ;
}


//Export the model
module.exports = mongoose.model('User', userSchema);