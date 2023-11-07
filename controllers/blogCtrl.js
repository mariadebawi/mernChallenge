
const Blog = require('../models/blogModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId');
const { cloudinaryUploadImg } = require('../utils/cloudinary');

const CreateBlog = asyncHandler(async (req, res, next) => {
  try {

    const newBlogt = await Blog.create(req.body)
    res.json({
      data: newBlogt,
      success: true
    })
  } catch (error) {
    throw new Error(error)
  }
})


const GetAllBlogs = asyncHandler(async (req, res, next) => {
  try {
    const findAllblogs = await Blog.find()
    .populate('likes', { firstname: 1, lastname: 1, mobile: 1   })
    .populate('dislikes', { firstname: 1, lastname: 1, mobile: 1  })
    .populate('category' , 'title -_id')
    res.json({
      data: findAllblogs,
      success: true
    })
  } catch (error) {
    throw new Error(error)
  }
})


//getOne
const GetBlogById = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  validateMongoDbId(id);

  try {  //   "firstname": "maria",   "lastname": "debawi",
    const findBlog = await Blog.findById(id)
      .populate('likes', { firstname: 1, lastname: 1, mobile: 1 })
      .populate('dislikes', { firstname: 1, lastname: 1, mobile: 1 })
    await Blog.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      { new: true })
    res.json({
      data: findBlog,
      success: true
    })
  } catch (error) {
    throw new Error(error)
  }
})


//delete One
const DeleteBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  validateMongoDbId(id);

  try {
    await Blog.findByIdAndDelete(id);
    res.json({
      //       data : findUser ,
      success: true
    })
  } catch (error) {
    throw new Error(error)
  }
})


const UpdateBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  validateMongoDbId(id);

  try {
    const blogUpdated = await Blog.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true
      })
      .populate('likes', { firstname: 1, lastname: 1, mobile: 1 })
      .populate('dislikes', { firstname: 1, lastname: 1, mobile: 1 });
    res.json({
      data: blogUpdated,
      success: true
    })
  } catch (error) {
    throw new Error(error)
  }
})

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  validateMongoDbId(blogId);
  try {
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      )

      res.json(blog);
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      )

      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  } catch (error) {
    throw new Error(error)
  }
  // Find the blog which you want to be liked

});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  validateMongoDbId(blogId);
  try {
    const blog = await Blog.findById(blogId);

    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isDisLiked = blog?.isDisliked;

    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );

    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  } catch (error) {
    throw new Error(error)
  }
  // Find the blog which you want to be liked

});


const UploadPictures = asyncHandler(async (req, res, next) => {
  const { blogId } = req.params;
  validateMongoDbId(blogId);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    //const urls = []
    let newpath;
    const files = req.files
    for (const file of files) {
        const { path } = file
        newpath = await uploader(path)
        //  urls.push(newpath)
        // fs.unlinkSync(path)
    }

    const findBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
          $push: {
              images: newpath
          }


      }, { new: true }
    )
    res.json({
      data: findBlog,
      success: true
    })

  } catch (error) {
    throw new Error(error)
  }
})




module.exports = {
  CreateBlog, GetAllBlogs,
  GetBlogById, DeleteBlog,
  UpdateBlog, UploadPictures,
  likeBlog, dislikeBlog
};

