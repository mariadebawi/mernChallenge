
const Color = require('../models/colorModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId');


const Createcolor = asyncHandler(async (req, res, next) => {
    try {
      
        const newcolor = await Color.create(req.body)
        res.json({
            data: newcolor,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


const GetAllcolors  = asyncHandler(async (req, res, next) => {
    try {
        const findAll = await Color.find();
        res.json({
            data: findAll,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


const GetcolorById = asyncHandler(async (req, res, next)  => {
    const { id} = req.params
    validateMongoDbId(id);

    try {
        const findOne = await Color.findById(id) ;
        res.json({
            data : findOne ,
            success : true
         })
    } catch (error) {
        throw new Error(error)
    }
 })



 const updatecolor = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        const colorUpdated = await Color.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true
            });
        res.json({
            data: colorUpdated,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


 const Deletecolor = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        await Color.findByIdAndDelete(id);
        res.json({
            //       data : findUser ,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})






module.exports = {
    Createcolor,
    GetAllcolors,
    GetcolorById,
    Deletecolor,
    updatecolor
 };