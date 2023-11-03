
const Adress = require('../models/adressModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId');


const CreateAdress = asyncHandler(async (req, res, next) => {
    try {
        const newAdress = await Adress.create(req.body)
        res.json({
            data: newAdress,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


const GetAllAdresss = asyncHandler(async (req, res, next) => {
    try {
        const findAll = await Adress.find();
        res.json({
            data: findAll,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


const GetAdressById = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        const findOne = await Adress.findById(id);
        res.json({
            data: findOne,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})



const updateAdress = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        const AdressUpdated = await Adress.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true
            });
        res.json({
            data: AdressUpdated,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})



const makedAdressDefault = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        const findAllAdress = await Adress.find();
        console.log(findAllAdress);
        //single adresse can be default:true
        for (const adress of findAllAdress) {
            await Adress.findByIdAndUpdate(
                adress.id,
                { isDefault: false },
                {
                    new: true
                });
        }
        const AdressUpdated = await Adress.findByIdAndUpdate(
            id,
            { isDefault: req?.body?.isDefault },
            {
                new: true
            });
        res.json({
            data: AdressUpdated,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})



const DeleteAdress = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        await Adress.findByIdAndDelete(id);
        res.json({
            //       data : findUser ,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})






module.exports = {
    CreateAdress,
    GetAllAdresss,
    GetAdressById,
    DeleteAdress,
    updateAdress,
    makedAdressDefault
};