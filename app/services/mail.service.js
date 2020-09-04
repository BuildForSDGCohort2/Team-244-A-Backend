const nodemailer = require("nodemailer");
const MailService = {
  /**
   * @description send email to user with different types
   * @param (string) email : the user email
   * @param (string) message : the message or token that has data sent through mail
   * @param (string) type : type that identify which message will be sent
   * @param (string) userName : the user name we'll send him the email
   * @returns (Boolean)
   */
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
        from: "SafeHome <" + String(process.env.EMAIL) + ">",
        to: email,
        subject: "👋 Please confirm your email",
        html:
          "<html><h1>  Hi " +
          userName +
          " 😊 , </h1> <p> you should confirm your email to complete your account </p> <h2> <a href='http://localhost:8080/confirm?token=" +
          message +
          "&type=signup' target ='_blank' style='color:green;'>Confirm</a></h2></html>",
      };
    } else if (type === "org") {
      mailOptions = {
        from: "SafeHome <" + String(process.env.EMAIL) + ">",
        to: email,
        subject: "👋 Thank you for joining safe home ",
        html:
          "<html><h1>   Hi " +
          userName +
          " 😊 , </h1> <p> Your request has been sent so please wait till we review your organization's information  </p> ",
      };
    } else if (type === "forget password") {
      mailOptions = {
        from: "SafeHome <" + String(process.env.EMAIL) + ">",
        to: email,
        subject: "👋 Please reset your password ",
        html:
          "<html><h1>   Hi " +
          userName +
          " 😊 , </h1> <p> please follow this link to reset your password  </p> <h2> <a href='http://localhost:8080/reset_password?token=" +
          message +
          "' target ='_blank'>Reset Password</a></h2></html>",
      };
    } else {
      mailOptions = {
        from: "SafeHome <" + String(process.env.EMAIL) + ">",
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
