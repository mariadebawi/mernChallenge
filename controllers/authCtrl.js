const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');
const validateMongoDbId = require('../utils/validateMongodbId');
const sendEmail = require('./emailCtrl');
const crypto = require('crypto');


//Register
const CreateUser = asyncHandler(async (req, res, next) => {
    const email = req.body.email
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        //Create new
        const newUser = await User.create(req.body);
        res.json({
            user: newUser,
            success: true
        })
    } else {
        throw new Error("User already existe")
        /* res.json( {
          msg : 'User already existe' ,
          success : false
         })*/
    }
});


//Login
const LoginUserCtr = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id)
        const updateUser = await User.findByIdAndUpdate(
            findUser?._id,
            { refreshToken : refreshToken  },
            { new: true }
            );
        res.cookie('refreshToken' , refreshToken,{
            httpOnly:true,
            maxAge : 72  * 60 * 60 * 1000
        })

        res.json({
            user: findUser,
            token: generateToken(findUser?._id),
            success: true
        })
    } else {
        throw new Error("Invalid Credentials")
    }
})


//LoginAdmin
const LoginAdminCtr = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const findAdmin = await User.findOne({ email });
    console.log(findAdmin?.role);
    if(findAdmin?.role !== "admin" ) { throw new Error('Not Autorizied')}

    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findAdmin?._id)
         await User.findByIdAndUpdate(
            findAdmin?._id,
            { refreshToken : refreshToken  },
            { new: true }
            ) ;
        res.cookie('refreshToken' , refreshToken,{
            httpOnly:true,
            maxAge : 72  * 60 * 60 * 1000
        })

        res.json({
            user: findAdmin,
            token: generateToken(findAdmin?._id),
            success: true
        })
    } else {
        throw new Error("Invalid Credentials")
    }
})



//refresh Token
const handleRefreshToken = asyncHandler(async (req, res, next) => {
    const cookie = req.cookies ;
    if(!cookie.refreshToken) throw Error('No refresh token exist')
    const refreshToken = cookie.refreshToken ;
    const user = await User.findOne({refreshToken})
    if(!user) throw Error('No refresh token present in db or not matched');
    jwt.verify(refreshToken , process.env.JWT_SECRET , (err, decoded) => {

       if(err || user.id !== decoded.id) {
        throw Error('there is something wrong with refresh token')
       }
       const accessToken = generateToken(user.id)
       res.json({accessToken})
    })

 })


 //logout
 const logout = asyncHandler(async (req, res, next) => {
    const cookie = req.cookies ;
    if(!cookie.refreshToken) throw Error('No refresh token exist')
    const refreshToken = cookie.refreshToken ;
    const user = await User.findOne({refreshToken})
   // console.log(user);
     if(!user){
        res.clearCookie('refreshToken' , {
            httpOnly :true ,
            secure:true
        })

        return res.sendStatus(204) //forbidden
     }

     await User.findByIdAndUpdate(user.id , {
        refreshToken :""
     })

     res.clearCookie('refreshToken' , {
        httpOnly :true ,
        secure:true
    })

    return res.sendStatus(204) //forbidden

  })



   //Reset password

   const resetPassword = asyncHandler(async (req, res, next)  => {
     const { newPassword} = req.body ;
     const { token } = req.params ;
     const hashToken = crypto.createHash("sha256").update(token).digest("hex")
     const user = await User.findOne({
        passwordResetToken : hashToken ,
        passwordResetExpires : {$gt : Date.now()}
     })
    // console.log(user);
     if(!user) { throw new Error('user not found with this email')}
     user.password = newPassword
     user.passwordResetToken = undefined
     user.passwordResetExpires = undefined
     await user.save() ;
     res.json({
        user: user,
        success: true
    })
   })




module.exports = {  LoginAdminCtr ,CreateUser,resetPassword ,LoginUserCtr ,handleRefreshToken ,logout  }