// const nodemailer = require("nodemailer");

// class EmailSender {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true, // use SSL for secure connection
//       auth: {
//         user: "danhussain28@gmail.com",
//         pass: "zujb fmcb jsiv ldqk",
//       },
//     });
//   }

//   sendEmail() {
//     const mailOptions = {
//       from: "danhussain28@gmail.com",
//       to: "kashifwakhani691@gmail.com",
//       subject: "Sending Email using Node.js",
//       text: "This is the plain text email content",
//     };
//     mailOptions.html = "<h1>Welcome!</h1><p>This is the HTML email content</p>";

//     this.transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error(error);
//       } else {
//         console.log("Email sent: ", info.response);
//       }
//     });
//   }
// }

// // Usage
// const emailSender = new EmailSender();
// emailSender.sendEmail();

const nodemailer = require("nodemailer");

// Function to send email
async function sendEmail(to, subject, text) {
  // Create a transporter using SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Message object
  let mailOptions = {
    from: process.env.EMAIL, // Sender address
    to: to, // List of recipients
    subject: subject, // Subject line
    text: text, // Plain text body
  };

  try {
    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw error;
  }
}

// Example usage
// sendEmail(
//   "recipient@example.com",
//   "Test Email",
//   "This is a test email from Node.js"
// )
//   .then(() => console.log("Email sent successfully"))
//   .catch((err) => console.error("Failed to send email:", err));

module.exports = sendEmail;
