///not Found
const notFound = (req, res, next) => {
    const error = new Error (`not Found' : ${req.originUrl}`)
    res.send(400) ;
    res.json({
        success : false
    })
    next(error)
}

//Error handler
const errorHandler = (err ,req, res, next) => { 
    const statusCode = res.statusCode === 200 ? 500 :res.statusCode
    res.status(statusCode)
    res.json({
        message : err?.message ,
        stack :  err?.stack ,
        success : false
    })
}


module.exports = { notFound,errorHandler }


