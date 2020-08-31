const nodemailer = require("nodemailer");
MailService = {
  async sendEmail(email, message, type, userName) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: String(process.env.EMAIL),
        pass: String(process.env.EMAIL_PASSWORD),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    let mailOptions;
    if (type === "confirm") {
      mailOptions = {
        from: '"SafeHome" <' + String(process.env.EMAIL) + ">",
        to: email,
        subject: "👋 Please confirm your email",
        html:
          "<html><h1>  Hi " +
          userName +
          ' 😊 , </h1> <p> you should confirm your email to complete your account </p> <h2> <a href="http://localhost:8080/confirm?token=' +
          message +
          '&type=signup" target ="_blank" style="color:green;">Confirm</a></h2></html>',
      };
    } else if (type === "forget Password") {
      mailOptions = {
        from: '"SafeHome Contact" <' + String(process.env.EMAIL) + ">",
        to: email,
        subject: "👋 Please reset your password ",
        html:
          "<html><h1>   Hi," +
          userName +
          ', 😊 </h1> <p> please, do not worry at all  </p> <p> follow this link to reset your password  </p> <h2> <a href="http://localhost:8080/reset_password?token=' +
          message +
          '" target ="_blank">Reset Password</a></h2></html>',
      };
    } else {
      mailOptions = {
        from: '"SafeHome Contact" <' + String(process.env.EMAIL) + ">",
        to: email,
        subject: "SafeHome has a message for you",
        text: message,
      };
    }
    transporter.sendMail(mailOptions);
    return 1;
  },
};
module.exports = MailService;
