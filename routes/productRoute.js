const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { GetAllProducts, Rating ,UploadPictures ,CreateProduct, UpdateProduct, DeleteProduct, GetProductById, addToWishList } = require('../controllers/productCtrl');
const { uploadPhoto, productImgResize, blogImgResize } = require('../middlewares/uploadImage');
const router = express.Router() ;

router.get('/getAll' ,GetAllProducts )
router.get('/:id', authMiddleware, GetProductById)
router.post('/createProduct',authMiddleware , isAdmin,CreateProduct )
router.put('/uploadFiles/:productID', authMiddleware, isAdmin,
uploadPhoto.array("images" ,100),
productImgResize ,UploadPictures)
router.put('/:id', authMiddleware, isAdmin, UpdateProduct)
router.delete('/:id', authMiddleware, isAdmin, DeleteProduct)
router.put('/addToWishList/:productID', authMiddleware, addToWishList)
router.put('/rating/:productID', authMiddleware, Rating)



module.exports = router