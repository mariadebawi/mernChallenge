const User = require('../models/userModel')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const Coupon = require('../models/couponModel')
const Order = require('../models/orderModel')

const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId');
const  uniqid = require('uniqid');



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
    try {
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
        res.json({
            data: cartUpdat,
            success: true
        })
    } catch (error) {
        throw new Error(error)

    }

  });


  const createNewOrder = asyncHandler(async (req, res) => {
    const { COD } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        if(!COD)    throw new Error('create order cash failed')
        const  cart = await Cart.findOne({ orderBy: _id})
        let finalAmount = 0
        finalAmount = cart.totalAfterDiscount >0 ? cart.totalAfterDiscount : cart.cartTotal
        let newOrder = await Order({
            products : cart.products ,
            paymentIntent :{
                id : uniqid() ,
                method : "COD" ,
                amount : finalAmount ,
                status : 'Cash On Delivery' ,
                created : Date.now(),
                currency : 'usd'
            },
            orderBy :_id,
            orderStatus : 'Cash On Delivery',

        }).save() ;

       let update =  cart.products.map((item) => {
            return {
                updateOne : {
                    filter : {_id : item.product._id} ,
                    update : {$inc  : { quantity : -item.count }}
                }
            }
        })

        const updated = await Product.bulkWrite(update  , {})

        res.json({
            data: newOrder,
            product : updated ,
            success: true
        })


    } catch (error) {
        throw new Error(error)

    }
  });


  const getMyOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const  order = await Order.find({ orderBy: _id}).populate('products.product')
        res.json({
            data: order,
            success: true
        })

    } catch (error) {
        throw new Error(error)

    }
  });


  const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    validateMongoDbId(orderId);
    try {
        const  order = await Order.findByIdAndUpdate(
            orderId ,
             {
                orderStatus : status ,
                paymentIntent : {
                    status :status
                }
             },
             {new:true}
        )
        res.json({
            data: order,
            success: true
        })

    } catch (error) {
        throw new Error(error)

    }
  });

   const getOrderUser = asyncHandler(async (req, res) => {

    const { userId } = req.params;
    validateMongoDbId(userId);
    try {
        const user = await User.findById( userId );
        console.log(user);
        const  order = await Order.find({ orderBy: user.id}).populate('products.product')
        res.json({
            data: order,
            success: true
        })

    } catch (error) {
        throw new Error(error)

    }
  });





module.exports = {  updateOrderStatus ,getOrderUser ,getMyOrders , createNewOrder ,applyCoupon, emptyCart, getUserCart, getMyCart, AddToCart }