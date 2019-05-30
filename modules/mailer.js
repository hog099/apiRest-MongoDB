const path = require('path')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

// const mailConfig = require('../config/mail.json')
const {host, port, user, pass} = require('../config/mail.json')

// var transport = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "dd80d5b639d588",
//       pass: "88783b242879b5"
//     }
//   });

var transport = nodemailer.createTransport({
    host,
    port,
    auth: {user, pass}
  });


//   transport.use('compile', hbs({
//       viewEngine: 'handlebars',
//       viewPath: path.resolve('./resources/mail/'),
//       extName: '.html'
//   }))
  const handlebarOptions = {
    viewEngine: {
      extName: '.html',
      partialsDir: path.resolve('./resources/mail/'),
      layoutsDir: path.resolve('./resources/mail/')
    },
    viewPath: path.resolve('./resources/mail/'),
    extName: '.html',
  };
  
  transport.use('compile', hbs(handlebarOptions));



  module.exports = transport