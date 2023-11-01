
const Brand = require('../models/brandModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId');


const CreateBrand = asyncHandler(async (req, res, next) => {
    try {
        const newBrand = await Brand.create(req.body)
        res.json({
            data: newBrand,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


const GetAllBrands  = asyncHandler(async (req, res, next) => {
    try {
        const findAll = await Brand.find();
        res.json({
            data: findAll,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


const GetBrandById = asyncHandler(async (req, res, next)  => {
    const { id} = req.params
    validateMongoDbId(id);

    try {
        const findOne = await Brand.findById(id) ;
        res.json({
            data : findOne ,
            success : true
         })
    } catch (error) {
        throw new Error(error)
    }
 })



 const updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        const BrandUpdated = await Brand.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true
            });
        res.json({
            data: BrandUpdated,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


 const DeleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        await Brand.findByIdAndDelete(id);
        res.json({
            //       data : findUser ,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})






module.exports = {
    CreateBrand,
    GetAllBrands,
    GetBrandById,
    DeleteBrand,
    updateBrand
 };