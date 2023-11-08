
const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { AddToCart, getMyCart ,getUserCart ,getMyOrders,emptyCart, applyCoupon, createNewOrder, getOrderUser, updateOrderStatus } = require('../controllers/cartOrderCtrl');
const router = express.Router() ;


router.post("/addToCart", authMiddleware, AddToCart);
router.get("/Mycart", authMiddleware, getMyCart);
router.get("/getUserCart/:userId", authMiddleware ,isAdmin, getUserCart);
router.delete("/emptyMyCart", authMiddleware, emptyCart);
router.patch("/applyCoupon", authMiddleware, applyCoupon);
router.post("/order/addNewCashOrder", authMiddleware, createNewOrder);
router.get("/order/getMyOrders", authMiddleware, getMyOrders);
router.get("/order/getUserOrders/:userId", authMiddleware,isAdmin, getOrderUser);
router.patch("/order/changeStatus/:orderId", authMiddleware,isAdmin, updateOrderStatus);



module.exports = router