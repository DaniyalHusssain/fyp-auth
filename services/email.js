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

module.exports = sendEmail;
