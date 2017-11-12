var nodemailer = require("nodemailer");

// setup e-mail data with unicode symbols
/*var mailOptions = {
    from: "Fred Foo ✔ <foo@blurdybloop.com>", // sender address
    to: "bar@blurdybloop.com, baz@blurdybloop.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
}*/

var sendMail = async (mailOptions, callback) => {

    const smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.smtpTransport,
            pass: process.env.smtpPass
        }
    })
    
    smtpTransport.sendMail(mailOptions, callback)
    
}

module.exports = function(){
    return sendMail;
}