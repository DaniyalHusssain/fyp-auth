const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL for secure connection
  auth: {
    user: "danhussain28@gmail.com",
    pass: "zujb fmcb jsiv ldqk",
  },
});

const mailOptions = {
  from: "danhussain28@gmail.com",
  to: "kashifwakhani691@gmail.com",
  subject: "Sending Email using Node.js",
  text: "This is the plain text email content",
};
mailOptions.html = "<h1>Welcome!</h1><p>This is the HTML email content</p>";

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Email sent: ", info.response);
  }
});
