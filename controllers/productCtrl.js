
const Product = require('../models/productModel')
const User = require('../models/userModel')
const fs = require('fs')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify');
const validateMongoDbId = require('../utils/validateMongodbId');
const { cloudinaryUploadImg  ,cloudinaryDeleteImg} = require('../utils/cloudinary');


//getAllProducts
const GetAllProducts = asyncHandler(async (req, res, next) => {
    try {

        const queryObj = { ...req.query }

        const exculdeFileds = ['page', "sort", "limit", "fields" ]
        exculdeFileds.forEach((el) => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        //console.log(queryStr);
        let query =Product.find(JSON.parse(queryStr))
        //sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ")
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt' )
        }

        //Limiting fields

        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ")
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        //pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            if (skip >= productCount) throw new Error('this page does not exist')
        }

        const findAll = await query.where('publish').equals(1)
        .populate('brand' , 'title -_id')
        .populate('category' , 'title -_id')
        .populate('color' , 'title -_id')

       // const productCount = await Product.countDocuments();

        const productCount = findAll.length;
        res.json({
            count: productCount,
            data: findAll,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})



//getOne
const GetProductById = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        const findProduct = await Product.findById(id);
        res.json({
            data: findProduct,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})




const CreateProduct = asyncHandler(async (req, res, next) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json({
            data: newProduct,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})

//update One
const UpdateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        const productUpdated = await Product.findByIdAndUpdate(id, req.body,
            {
                new: true
            });
        res.json({
            data: productUpdated,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})




//delete One
const DeleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        await Product.findByIdAndDelete(id);
        res.json({
            //       data : findUser ,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


const addToWishList = asyncHandler(async (req, res) => {
    const { productID } = req.params;
    validateMongoDbId(productID);
    try {
        const loginUserId = req?.user?._id;
        const user = await User.findById(loginUserId);

        const alreadyWish = user?.wishlist?.find(
            (pp) => pp?.toString() === productID
        );

        if (alreadyWish) {
            const user = await User.findByIdAndUpdate(
                loginUserId,
                {
                    $pull: { wishlist: productID },
                },
                { new: true }
            );
            res.json({
                data: user,
                success: true
            })
        } else {
            const user = await User.findByIdAndUpdate(
                loginUserId,
                {
                    $push: { wishlist: productID },
                },
                { new: true }
            );
            res.json({
                data: user,
                success: true
            })
        }

    } catch (error) {
        throw new Error(error)
    }

})


const Rating = asyncHandler(async (req, res, next) => {
    const { productID } = req.params;
    const { start, comment } = req.body;
    validateMongoDbId(productID);
    try {
        const product = await Product.findById(productID);
        // find the login user
        const loginUserId = req?.user?._id;

        const alreadyRating = product?.postedBy?.find(
            (userId) => userId?.toString() === loginUserId?.toString()
        );

        if (alreadyRating) {

            const ratingUpdate = await Product.updateOne(
                {
                    rating: { $elemMatch: alreadyRating }
                },
                {
                    $set: { "ratings.$.star": start, "ratings.$.comment": comment }
                }
            )

        } else {
            const ratingsProduct = await Product.findByIdAndUpdate(
                productID,
                {
                    $push: {
                        rating: {
                            postedBy: loginUserId,
                            star: start,
                            comment: comment
                        },

                    },
                },
                { new: true }

            );


        }

        const getTotalRating = await Product.findById(productID);
        let totalRating = getTotalRating.rating.length
        let ratingSum = getTotalRating.rating.map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0)
        let ratingResult = Math.round(ratingSum / totalRating)

        const productRated = await Product.findByIdAndUpdate(
            productID,
            {
                totalrating: ratingResult
            },

            { new: true }
        )

        res.json({
            data: productRated,
            success: true
        })

    } catch (error) {
        throw new Error(error)
    }
})


const UploadPictures = asyncHandler(async (req, res, next) => {
    const { productID } = req.params;
    validateMongoDbId(productID);
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
        const findProduct = await Product.findByIdAndUpdate(
            productID,
            {
                $push: {
                    images: newpath
                }


            }, { new: true }
        )
        res.json({
            data: findProduct,
            success: true
        })

    } catch (error) {
        throw new Error(error)
    }
})


const deletePictures = asyncHandler(async (req, res, next) => {
    const { productID , public_id } = req.params;
    const { image } = req.body.image;

    validateMongoDbId(productID);
    try {
        const uploader =  cloudinaryDeleteImg(req.body.image);

        const findProduct = await Product.findByIdAndUpdate(
            productID,
            {
                $pull: {
                    images: image
                }


            }, { new: true }
        )
        res.json({
            data: findProduct,
            success: true
        })

    } catch (error) {
        throw new Error(error)
    }
})

//archive One
const archiveProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        const productUpdated = await Product.findByIdAndUpdate(id,
            {publish : 0},
            {
                new: true
            });
        res.json({
            data: productUpdated,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})


//restore One
const restoreProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    validateMongoDbId(id);

    try {
        const productUpdated = await Product.findByIdAndUpdate(id,
            {publish : 1},
            {
                new: true
            });
        res.json({
            data: productUpdated,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
})



//getAllRestore
const getAllArchive = asyncHandler(async (req, res, next) => {
    try {
        const findAllRestore = await Product.where('publish').equals(0)
        const productCount = findAllRestore.length;
        res.json({
            count: productCount,
            data: findAllRestore,
            success: true
        })

    } catch (error) {
        throw new Error(error)
    }
 })


module.exports = {
    GetAllProducts,
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    GetProductById,
    addToWishList,
    Rating,
    UploadPictures ,
    archiveProduct,
    restoreProduct ,
    getAllArchive ,
    deletePictures
}