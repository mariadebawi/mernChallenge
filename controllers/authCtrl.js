const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')


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
            ) ;
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


module.exports = { CreateUser, LoginUserCtr ,handleRefreshToken }