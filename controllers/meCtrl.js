
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId');


 //update profile
 const UpdateProfile = asyncHandler(async (req, res, next)  => {
    const { _id} = req.user
    validateMongoDbId(_id);

    try {
        const UserUpdated = await User.findByIdAndUpdate(_id , {
           firstname :  req.body?.firstname ,
           lastname :  req.body.lastname ,
           mobile :  req.body?.mobile ,
           email :  req.body?.email ,

        } , {
            new:true
        }) ;
        res.json({
            data : UserUpdated ,
            success : true
         })
    } catch (error) {
        throw new Error(error)
    }
 })


 //find me
 const findMe = asyncHandler(async (req, res, next)  => {
    const { _id} = req.user
    validateMongoDbId(_id);

    try {
        const findMee = await User.findById(_id).populate('address')
        res.json({
            data : findMee ,
            success : true
         })
    } catch (error) {
        throw new Error(error)
    }
 })

  //updatePassword
  const updatePassword = asyncHandler(async (req, res, next)  => {
    const { _id } = req.user._id ;
    const { newPassword} = req.body ;
    validateMongoDbId(_id);
    const userConnected = await User.findById(_id) ;
    if(newPassword) {
      userConnected.password = newPassword ;
      const updateUSer = await userConnected.save();
      res.json({
          user: updateUSer,
          success: true
      })

    }
})

//getWishlist

const getWishList = asyncHandler(async (req, res, next)  => {
    const { _id } = req.user._id ;
    validateMongoDbId(_id);
    const wishList = await User.findById(_id).populate('wishlist') ;
      res.json({
          user: wishList,
          success: true
      })

})


//update Adress
const UpdatedAdress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user._id ;
    const { adressId } = req.body ;
    validateMongoDbId(_id);
    try {

      const findUser = await User.findByIdAndUpdate(
        _id,
        {
            $push: {
                address: adressId
            }


        }, { new: true }
      )
      res.json({
        data: findUser,
        success: true
      })

    } catch (error) {
      throw new Error(error)
    }
  })





module.exports = {findMe , UpdateProfile , updatePassword ,getWishList ,UpdatedAdress}