const User = require('../models/userModel')

const CreateUser = async (req , res ) => {
  
    const email = req.body.email
    const findUser = await User.findOne({email :email}) ;
    if(!findUser) {
      //Create new 
      const newUser = await User.create(req.body) ;
      res.json({
       user : newUser ,
       success : true
    })
    }else {
       res.json( {
        msg : 'User already existe' ,
        success : false
       })
    }
}


module.exports = {CreateUser}