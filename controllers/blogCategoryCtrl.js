
const CategoryBlog = require('../models/blogCategoryModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId');


const CreateCategory = asyncHandler(async (req, res, next) => {
    try {
        const newCategory = await CategoryBlog.create(req.body)
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
        const findAll = await CategoryBlog.find();
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
        const findOne = await CategoryBlog.findById(id) ;
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
        const categoryUpdated = await CategoryBlog.findByIdAndUpdate(
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
        await CategoryBlog.findByIdAndDelete(id);
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