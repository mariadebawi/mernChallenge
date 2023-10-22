const express = require('express');
const { CreateUser ,LoginUserCtr } = require('../controllers/authCtrl');
const router = express.Router() ;

router.post('/register',CreateUser )
router.post('/login',LoginUserCtr )


module.exports = router