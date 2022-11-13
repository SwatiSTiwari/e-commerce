const nodemailer = require("nodemailer");

const mailHelper = async (opition) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,

    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });

  const message = {
    from: "swatistiwati13@gmail.com", // sender address
    to: opition.email, // list of receivers
    subject: opition.subject, // Subject line
    text: opition.message, // plain text body
    // html: "<a>Hello world?</a>", // html body
  };

  await transporter.sendMail(message);
};

module.exports = mailHelper;
