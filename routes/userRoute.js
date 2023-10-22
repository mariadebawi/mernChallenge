const express = require('express');
const { GetAllUsers, GetUserById ,DeleteUser ,UpdateUser } = require('../controllers/userCtrl');
const router = express.Router() ;

router.get('/allUsers',GetAllUsers )
router.get('/:id',GetUserById )
router.delete('/:id',DeleteUser )
router.put('/:id',UpdateUser )

module.exports = router