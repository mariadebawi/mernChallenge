const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { GetAllAdresss, CreateAdress, GetAdressById, DeleteAdress, updateAdress, makedAdressDefault } = require('../controllers/adressCtrl');
const router = express.Router() ;


router.post('/createAdress', authMiddleware , isAdmin  , CreateAdress )
router.get('/getAll'   ,GetAllAdresss )
router.get('/:id'  , authMiddleware ,GetAdressById )
router.delete('/:id', authMiddleware , isAdmin  ,DeleteAdress )
router.put('/:id'   , authMiddleware , isAdmin  , updateAdress )
router.patch("/changeStatus/:id", authMiddleware, isAdmin, makedAdressDefault)




module.exports = router