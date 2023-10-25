const express = require('express');
const { CreateUser ,LoginUserCtr, handleRefreshToken } = require('../controllers/authCtrl');
const router = express.Router() ;

router.post('/register',CreateUser )
router.post('/login',LoginUserCtr )
router.get('/refreshToken',handleRefreshToken )


module.exports = router