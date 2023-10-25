const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000  ;
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
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

/////AUTH
app.use('/api/auth' ,authRouter)

/////CRUD USERS
app.use('/api/users' ,userRouter)



app.use(notFound)
app.use(errorHandler)


//PORT 
app.listen(PORT , ()=> {
    console.log(  `Server is running  at PORT ${PORT}`)
})
