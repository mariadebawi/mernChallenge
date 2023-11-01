
const CategoryProduct = require('../models/productCategoryModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId');


const CreateCategory = asyncHandler(async (req, res, next) => {
    try {
        const newCategory = await CategoryProduct.create(req.body)
        res.json({
            data: newCategory,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


const GetAllCategories  = asyncHandler(async (req, res, next) => {
    try {
        const findAll = await CategoryProduct.find();
        res.json({
            data: findAll,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


const GetCategoryById = asyncHandler(async (req, res, next)  => {
    const { id} = req.params
    validateMongoDbId(id);

    try {
        const findOne = await CategoryProduct.findById(id) ;
        res.json({
            data : findOne ,
            success : true
         })
    } catch (error) {
        throw new Error(error)
    }
 })



 const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        const categoryUpdated = await CategoryProduct.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true
            });
        res.json({
            data: categoryUpdated,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


 const DeleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        await CategoryProduct.findByIdAndDelete(id);
        res.json({
            //       data : findUser ,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})






module.exports = {
    CreateCategory,
    GetAllCategories,
    GetCategoryById,
    DeleteCategory,
    updateCategory
 };