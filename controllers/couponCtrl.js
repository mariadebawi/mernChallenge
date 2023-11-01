
const Coupon = require('../models/couponModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId');


const CreateCoupon = asyncHandler(async (req, res, next) => {
    try {
        const newCoupon = await Coupon.create(req.body)
        res.json({
            data: newCoupon,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


const GetAllCoupons  = asyncHandler(async (req, res, next) => {
    try {
        const findAll = await Coupon.find();
        res.json({
            data: findAll,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


const GetCouponById = asyncHandler(async (req, res, next)  => {
    const { id} = req.params
    validateMongoDbId(id);

    try {
        const findOne = await Coupon.findById(id) ;
        res.json({
            data : findOne ,
            success : true
         })
    } catch (error) {
        throw new Error(error)
    }
 })



 const updateCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        const CouponUpdated = await Coupon.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true
            });
        res.json({
            data: CouponUpdated,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


 const DeleteCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        await Coupon.findByIdAndDelete(id);
        res.json({
            //       data : findUser ,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})






module.exports = {
    CreateCoupon,
    GetAllCoupons,
    GetCouponById,
    DeleteCoupon,
    updateCoupon
 };