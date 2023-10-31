const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')


const sendEmail = asyncHandler(async (data ,req, res)  => {
    let  transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MP,
        },
      });

      let info = await transporter.sendMail({
        from: '"HII', // sender address
        to:  data.to  , // "bar@example.com, baz@example.com", // list of receivers
        subject: data.subject , // Subject line
        text:  data.text  , // plain text body
        html:   data.html , // html body
      });

    //  console.log(info);
})

module.exports =  sendEmail ;
