import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmailForgotPassword(to: string, html: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,//"patricia.larson13@ethereal.email", // generated ethereal user
      pass: testAccount.pass//"WNdjFAYNHwqudQ2DBt", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"movieClub 🎥" <foo@example.com>', // sender address
    to,
    subject: "movieClub: Forgot Password Link", // Subject line
    html, // plain text body
  });

  console.log(info);
  console.log(info.messageId);
  console.log(nodemailer.getTestMessageUrl(info));

  console.log("email sent");
}