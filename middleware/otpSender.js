const { customOtpGen } = require("otp-gen-agent"),
  DB = require("../models/otpModel"),
  nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

module.exports = {
  sendEmail: async (user) => {
    const code = await customOtpGen({ length: 5 });

    await new DB({
      otp: code,
      userId: user._id,
      expire: Date.now() + 120000, //for expire OTP Code
    }).save();

    const ejs = require("ejs");

    ejs.renderFile(
      __dirname + "/views/email.ejs",
      { code: code },
      async (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const mail = {
            from: process.env.user,
            to: user.email,
            subject: "OTP Code",
            html: data,
          };
          await transporter.sendMail(mail, (err, info) => {
            if (err) {
              console.log("i am error", err);
            } else console.log(info);
          });
        }
      }
    );
  },
};
