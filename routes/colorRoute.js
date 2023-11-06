const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { Createcolor, GetAllcolors, GetcolorById, updatecolor, Deletecolor } = require('../controllers/colorCtrl');
const router = express.Router() ;


router.post('/createColor', authMiddleware , isAdmin  , Createcolor )
router.get('/getAll'   ,GetAllcolors )
router.get('/:id'   ,GetcolorById )
router.delete('/:id', authMiddleware , isAdmin  ,Deletecolor )
router.put('/:id'   ,updatecolor )




module.exports = router