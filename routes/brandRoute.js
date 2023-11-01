const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { CreateBrand, GetAllBrands, GetBrandById, DeleteBrand, updateBrand } = require('../controllers/brandCtrl');
const router = express.Router() ;


router.post('/createBrand', authMiddleware , isAdmin  , CreateBrand )
router.get('/getAll'   ,GetAllBrands )
router.get('/:id'   ,GetBrandById )
router.delete('/:id', authMiddleware , isAdmin  ,DeleteBrand )
router.put('/:id'   ,updateBrand )




module.exports = router