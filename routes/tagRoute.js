const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { CreateTag, GetAllTags, GetTagById, updateTag, DeleteTag } = require('../controllers/tagCtrl');
const router = express.Router() ;


router.post('/createTag', authMiddleware , isAdmin  , CreateTag )
router.get('/getAll'   ,GetAllTags )
router.get('/:id'   ,GetTagById )
router.delete('/:id', authMiddleware , isAdmin  ,DeleteTag )
router.put('/:id'   ,updateTag )




module.exports = router