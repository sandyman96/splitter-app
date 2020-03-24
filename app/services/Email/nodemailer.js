const nodemailer = require('nodemailer');
const mailServer = require('../../configs/email').mailServer;

var y = function(from, to, subject, text, next) {
// config for mailserver and mail, input your data
const config = {
  // mailserver: {
  //   host: process.env.MAIL_HOST,
  //   port: MAIL_PORT,
  //   secure: false,
  //   auth: {
  //     user: MAIL_USER,
  //     pass: MAIL_PASSWORD
  //   }
  // }
  mailServer
  ,
  mail: {
    // from: 'splitterwebapp@gmail.com',
    form: from,
    // to: 'sandeepraman@qburst.com',
    to: to,
    // subject: 'Hey',
    subject: subject,
    // text: 'Testing Nodemailer'
    text: text
  }
};

const sendMail = async ( mailserver, mail ) => {
  // create a nodemailer transporter using smtp
  let transporter = nodemailer.createTransport(mailserver);

  // send mail using transporter
  let info = await transporter.sendMail(mail);
  console.log(`Preview: ${nodemailer.getTestMessageUrl(info)}`);
};

sendMail(config.mailServer, config.mail).catch( (err) => {
   next("err", "error");
});
 next(null, "success");
}

module.exports = y;