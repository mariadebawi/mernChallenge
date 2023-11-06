const User = require('../models/userModel')
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

//getALLUsers
const GetAllUsers = asyncHandler(async (req, res, next)  => {
    try {
        const findAllUsers = await User.find() ;
        res.json({
            data : findAllUsers ,
            success : true
         })
    } catch (error) {
        throw new Error(error)
    }
 })


 //getOne
 const GetUserById = asyncHandler(async (req, res, next)  => {
    const { id} = req.params
    validateMongoDbId(id);

    try {
        const findUser = await User.findById(id) ;
        res.json({
            data : findUser ,
            success : true
         })
    } catch (error) {
        throw new Error(error)
    }
 })



  //delete One
  const DeleteUser = asyncHandler(async (req, res, next)  => {
    const { id} = req.params
    validateMongoDbId(id);

    try {
        const findUser = await User.findByIdAndDelete(id) ;
        res.json({
     //       data : findUser ,
            success : true
         })
    } catch (error) {
        throw new Error(error)
    }
 })

   //update One
   const UpdateUser = asyncHandler(async (req, res, next)  => {
    const { id} = req.params
    validateMongoDbId(id);

    try {
        const UserUpdated = await User.findByIdAndUpdate(id , {
           firstname :  req.body?.firstname ,
           lastname :  req.body.lastname ,
           mobile :  req.body?.mobile ,
           email :  req.body?.email ,
           role :  req.body?.role ,
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
   //update role

 const updateRole = asyncHandler(async (req, res, next)  => {
    const {id } = req.params ;
    validateMongoDbId(id);

    try {
        const UserUpdated = await User.findByIdAndUpdate(id , {
           role :  req?.body?.role  ,
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


       //block/unblock profile
    const changeStatus = asyncHandler(async (req, res, next)  => {
        const {id } = req.params ;
        validateMongoDbId(id);
        try {
            const UserUpdated = await User.findByIdAndUpdate(id , {
               isBlocked :  req?.body?.isBlocked  ,
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




module.exports = {
    GetAllUsers ,
    GetUserById ,
    DeleteUser ,
    UpdateUser ,
    changeStatus,
    updateRole
}