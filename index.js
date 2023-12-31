const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express()
const morgan = require('morgan');
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000  ;
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const meRouter = require('./routes/meRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const categoryProductRouter = require('./routes/productCategoryRoute');
const categoryBlogRouter = require('./routes/blogCategoryRoute');
const brandRouter = require('./routes/brandRoute');
const colorsRouter = require('./routes/colorRoute');
const tagsRouter = require('./routes/tagRoute');
const cartRouter = require('./routes/cartOrderRoute');


const couponRouter = require('./routes/couponRoute');
const adressRouter = require('./routes/adressRoute');

app.use(morgan("dev"))

const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
dbConnect() ;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended :false}))

app.use(cookieParser())


/* app.use('/' , (req,res) => {
    res.send('Heloo!!')
}) */

/////AUTH ,RESET/FORGET PASSWORD ,

app.use('/api/auth' ,authRouter)

/////CRUD USERS
app.use('/api/users' ,userRouter)

app.use('/api/me' , meRouter)

/////CRUD PRODUCTS
app.use('/api/products' ,productRouter)

/////CRUD blogs
app.use('/api/blogs' ,blogRouter)

/////CRUD categoriesProduct
app.use('/api/categoriesProduct' ,categoryProductRouter)

/////CRUD categories blog
app.use('/api/categoriesBlog' ,categoryBlogRouter)

/////CRUD brands
app.use('/api/brands' ,brandRouter)

/////CRUD brands
app.use('/api/colors' ,colorsRouter)

/////CRUD tag
app.use('/api/tags' ,tagsRouter)

/////CRUD adress
app.use('/api/adress' ,adressRouter)


/////CRUD cart
app.use('/api/cart' ,cartRouter)


/////CRUD coupons
app.use('/api/coupons' ,couponRouter)


app.use(notFound)
app.use(errorHandler)


//PORT
app.listen(PORT , ()=> {
    console.log(  `Server is running  at PORT ${PORT}`)
})
