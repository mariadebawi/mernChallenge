const express = require('express');
const { CreateUser ,LoginUserCtr, handleRefreshToken, logout } = require('../controllers/authCtrl');
const router = express.Router() ;

router.post('/register',CreateUser )
router.post('/login',LoginUserCtr )
router.get('/refreshToken',handleRefreshToken )
router.get('/logout',logout )


module.exports = router