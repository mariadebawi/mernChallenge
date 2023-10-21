const {default:mongoose} = require ('mongoose')

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL)
        console.log('connection done !!!!');
    } catch (error) {
        console.log('connection not working !!!!');
         throw new Error(error)
    }
    
}


module.exports = dbConnect ;