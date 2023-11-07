
const Tag = require('../models/tagModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId');


const CreateTag = asyncHandler(async (req, res, next) => {
    try {

        const newtag = await Tag.create(req.body)
        res.json({
            data: newtag,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


const GetAllTags  = asyncHandler(async (req, res, next) => {
    try {
        const findAll = await Tag.find();
        res.json({
            data: findAll,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


const GetTagById = asyncHandler(async (req, res, next)  => {
    const { id} = req.params
    validateMongoDbId(id);

    try {
        const findOne = await Tag.findById(id) ;
        res.json({
            data : findOne ,
            success : true
         })
    } catch (error) {
        throw new Error(error)
    }
 })



 const updateTag = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        const tagUpdated = await Tag.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true
            });
        res.json({
            data: tagUpdated,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


 const DeleteTag = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        await Tag.findByIdAndDelete(id);
        res.json({
            //       data : findUser ,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = {
    CreateTag,
    GetAllTags,
    GetTagById,
    DeleteTag,
    updateTag
 };