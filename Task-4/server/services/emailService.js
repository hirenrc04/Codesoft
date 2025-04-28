// server/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendApplicationConfirmation = async (to, jobTitle, companyName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your job application has been submitted',
    html: `
      <div>
        <h2>Thank you for applying!</h2>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been received.</p>
        <p>We'll review your application and get back to you soon.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendApplicationConfirmation };