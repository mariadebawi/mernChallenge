const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { CreateCoupon, GetAllCoupons, GetCouponById, DeleteCoupon, updateCoupon } = require('../controllers/couponCtrl');
const router = express.Router() ;


router.post('/createCoupon', authMiddleware , isAdmin  ,CreateCoupon )
router.get('/getAll'   ,GetAllCoupons )
router.get('/:id'   ,GetCouponById )
router.delete('/:id', authMiddleware , isAdmin  ,DeleteCoupon )
router.put('/:id'   ,updateCoupon )




module.exports = router