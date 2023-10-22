const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const CreateUser = asyncHandler(async (req, res, next)  => {
    const email = req.body.email
    const findUser = await User.findOne({email :email}) ;
    if(!findUser) {
      //Create new 
      const newUser = await User.create(req.body) ;
      res.json({
       user : newUser ,
       success : true
    })
    }else {
        throw new Error("User already existe")
      /* res.json( {
        msg : 'User already existe' ,
        success : false
       })*/
    }
});



const LoginUserCtr = asyncHandler(async (req, res, next)  => {
    const {email , password} = req.body ;
    const findUser = await User.findOne({email}) ;
    if( findUser && ( await findUser.isPasswordMatched(password))){
        res.json({
            user : findUser ,
            token : generateToken(findUser._id) ,
            success : true
         })
    }else {
        throw new Error("Invalid Credentials")
    }

    
})




module.exports = {CreateUser ,LoginUserCtr}