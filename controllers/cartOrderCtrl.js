const User = require('../models/userModel')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const Coupon = require('../models/couponModel')

const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId');



const AddToCart = asyncHandler(async (req, res, next) => {
    const { cart } = req.body;
    console.log(cart._id);
    const { _id } = req.user._id
    console.log(_id);
    validateMongoDbId(_id);
    try {
        let products = [];
        const user = await User.findById(_id)
        let alreadyExistCart = await Cart.findOne({ orderBy: user.id })
        if (alreadyExistCart) {
            alreadyExistCart = []
        }

        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i].id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i].id).select('price').exec()
            object.price = getPrice.price;
            products.push(object)
        }
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderBy: user.id
        }).save()

        res.json({
            data: newCart,
            success: true
        })

    } catch (error) {
        throw new Error(error)
    }
})

const getMyCart = asyncHandler(async (req, res, next) => {
    const { _id } = req.user._id
    console.log(_id);
    validateMongoDbId(_id);
    try {
        let findCartList = await Cart.findOne({ orderBy: _id })
        //.populate('products.product')

        res.json({
            data: findCartList,
            success: true
        })

    } catch (error) {
        throw new Error(error)
    }
})



const getUserCart = asyncHandler(async (req, res, next) => {
    const { userId } = req.params
    validateMongoDbId(userId);
    try {
        let findCartList = await Cart.findOne({ orderBy: userId }).populate('products.product')

        res.json({
            data: findCartList,
            success: true
        })

    } catch (error) {
        throw new Error(error)
    }
})


const emptyCart = asyncHandler(async (req, res, next) => {
    const { _id } = req.user._id
    validateMongoDbId(_id);
    try {
        await Cart.findOneAndRemove({ orderBy: _id })
        res.json({
            data: [],
            success: true
        })

    } catch (error) {
        throw new Error(error)
    }

})

const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon === null) {
      throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({ _id });
    const  cart = await Cart.findOne({
      orderBy: user._id,
    })
   // console.log(cartTotal);
    let totalAfterDiscount = (
        cart.cartTotal -
      (cart.cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
   const cartUpdat =  await Cart.findByIdAndUpdate(
    cart._id ,
      { totalAfterDiscount },
      { new: true }
    );
    res.json(cartUpdat)
  });




module.exports = { applyCoupon, emptyCart, getUserCart, getMyCart, AddToCart }