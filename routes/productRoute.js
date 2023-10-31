const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { GetAllProducts, CreateProduct, UpdateProduct, DeleteProduct, GetProductById } = require('../controllers/productCtrl');
const router = express.Router() ;

router.get('/getAll' ,GetAllProducts )
router.get('/:id', authMiddleware, GetProductById)
router.post('/createProduct',authMiddleware , isAdmin,CreateProduct )
router.put('/:id', authMiddleware, isAdmin, UpdateProduct)
router.delete('/:id', authMiddleware, isAdmin, DeleteProduct)


module.exports = router