
const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { AddToCart, getMyCart ,getUserCart ,emptyCart, applyCoupon } = require('../controllers/cartOrderCtrl');
const router = express.Router() ;


router.post("/addToCart", authMiddleware, AddToCart);
router.get("/Mycart", authMiddleware, getMyCart);
router.get("/getUserCart/:userId", authMiddleware, getUserCart);
router.delete("/emptyMyCart", authMiddleware, emptyCart);
router.patch("/applyCoupon", authMiddleware, applyCoupon);


module.exports = router