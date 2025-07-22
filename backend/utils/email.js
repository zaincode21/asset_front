const nodemailer = require('nodemailer');

exports.sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sergedukuziyaremye@gmail.com',
      pass: 'jkxv kcws nsfv yfwa' // Use an app password, not your real password
    }
  });

  await transporter.sendMail({
    from: 'sergedukuziyaremye@gmail.com',
    to,
    subject,
    text
  });
}; 