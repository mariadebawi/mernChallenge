const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { CreateCategory, GetAllCategories, GetCategoryById, DeleteCategory ,updateCategory } = require('../controllers/blogCategoryCtrl');
const router = express.Router() ;


router.post('/createCategory', authMiddleware , isAdmin  ,CreateCategory )
router.get('/getAll'   ,GetAllCategories )
router.get('/:id'   ,GetCategoryById )
router.delete('/:id', authMiddleware , isAdmin  ,DeleteCategory )
router.put('/:id'   ,updateCategory )




module.exports = router