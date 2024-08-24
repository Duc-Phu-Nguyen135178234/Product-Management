const nodemailer = require('nodemailer');

module.exports.sendEmail = (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // which email serive you use
    auth: {
      user: "kevin.nguyen240681@gmail.com",
      pass: "xnsi zeog zpey idpr"
    }
  });

  const mailOptions = {
    from: "kevin.nguyen240681@gmail.com",
    to: email,
    subject: subject, // subject and html is different
    html: html
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}