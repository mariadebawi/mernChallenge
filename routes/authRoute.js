const express = require('express');
const { CreateUser ,LoginUserCtr, handleRefreshToken, logout, updatePassword, forgotPassword, resetPassword, LoginAdminCtr } = require('../controllers/authCtrl');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router() ;

router.post('/register',CreateUser )
router.post('/login',LoginUserCtr )
router.get('/refreshToken',handleRefreshToken )
router.get('/logout',logout )
router.put('/updatePassword', authMiddleware,updatePassword )
router.get('/forgot-password',forgotPassword )
router.post('/reset-password/:token',resetPassword )
router.post('/loginAdmin',LoginAdminCtr )



module.exports = router