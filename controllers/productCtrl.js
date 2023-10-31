
const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify');
const validateMongoDbId = require('../utils/validateMongodbId');

//getAllProducts
const GetAllProducts = asyncHandler(async (req, res, next) => {
    try {

        //filter
        const queryObj = {...req.query}
        const exculdeFileds = ['page' , "sort" , "limit" ,"fields"]
        exculdeFileds.forEach((el) => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g , (match) => `$${match}` )
        let  query = Product.find(JSON.parse(queryStr))
        const productCount = await Product.countDocuments() ;
        //sorting
         if(req.query.sort) {
           const sortBy = req.query.sort.split(",").join(" ")
           query = query.sort(sortBy)
         }else {
            query = query.sort('-createdAt')
         }

         //Limiting fields

         if(req.query.fields) {
            const fields = req.query.fields.split(",").join(" ")
            query = query.select(fields)
          }else {
             query = query.select('-__v')
          }

          //pagination

          const page = req.query.page ;
          const limit = req.query.limit ;
          const skip = (page - 1 ) * limit ;
          query = query.skip(skip).limit(limit);
          if(req.query.page) {
            if(skip >=  productCount) throw new Error('this page does not exist')
          }

        const findAll = await query;
        res.json({
            data: findAll,
            count:productCount ,
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
  const DeleteProduct = asyncHandler(async (req, res, next)  => {
    const { id} = req.params
    validateMongoDbId(id);

    try {
        await Product.findByIdAndDelete(id) ;
        res.json({
     //       data : findUser ,
            success : true
         })
    } catch (error) {
        throw new Error(error)
    }
 })



module.exports = {
    GetAllProducts,
    CreateProduct,
    UpdateProduct,
    DeleteProduct
}