const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { updatePassword, UpdateProfile, getWishList, UpdatedAdress, findMe } = require('../controllers/meCtrl');
const router = express.Router() ;

router.get("", authMiddleware, findMe);
router.put('/updatePassword', authMiddleware,updatePassword )
router.put("/edit-profile", authMiddleware, UpdateProfile);
router.get("/wishlist", authMiddleware, getWishList);
router.put("/updateAdress", authMiddleware, UpdatedAdress);







module.exports = router