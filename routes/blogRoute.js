const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { CreateBlog,UploadPictures , GetAllBlogs, GetBlogById, DeleteBlog, UpdateBlog, likeBlog, dislikeBlog } = require('../controllers/blogCtrl');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImage');
const router = express.Router() ;


router.post('/createBlog', authMiddleware , isAdmin  ,CreateBlog )
router.get('/getAll'   ,GetAllBlogs )
router.get('/:id'   , GetBlogById )
router.delete('/:id' ,authMiddleware , isAdmin, DeleteBlog )
router.put('/:id'   ,authMiddleware , isAdmin, UpdateBlog )
router.put('/likeBlog/:blogId'   ,authMiddleware , likeBlog )
router.put('/dislikeBlog/:blogId'   ,authMiddleware , dislikeBlog )

router.put('/uploadFilesBlog/:blogId', authMiddleware, isAdmin,
uploadPhoto.array("images" ,100),
blogImgResize ,UploadPictures)

module.exports = router