const express = require('express');
const { CreateUser ,LoginUserCtr, handleRefreshToken, logout, resetPassword, LoginAdminCtr } = require('../controllers/authCtrl');
const router = express.Router() ;

router.post('/register',CreateUser )
router.post('/login',LoginUserCtr )
router.get('/refreshToken',handleRefreshToken )
router.get('/logout',logout )
router.post('/reset-password/:token',resetPassword )
router.post('/loginAdmin',LoginAdminCtr )



module.exports = router