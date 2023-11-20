const nodemailer = require("nodemailer");
require("dotenv").config();

const sendConfirmationEmail = async (email, usrValCod) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Código de confirmación",
    text: `Tu código de confirmación es: ${usrValCod}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de confirmación enviado");
  } catch (error) {
    console.error("Hubo un error al enviar el correo de confirmación: ", error);
  }
};

module.exports = { sendConfirmationEmail };
