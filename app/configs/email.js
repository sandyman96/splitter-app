require('custom-env').env('staging')

const mailServer = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASSWORD
}
}
module.exports = {
  mailServer: mailServer
}