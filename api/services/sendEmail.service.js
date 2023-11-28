const nodemailer = require("nodemailer");
require("dotenv").config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendConfirmationEmail = async (email, usrValCod) => {
  const transporter = createTransporter();

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

const sendDenunciaEmail = async (
  usrDNI,
  usrNom,
  usrApe,
  denRazSoc,
  denMovPla,
  denFec,
  denHor,
  denEvi
) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_COMPLAINT,
    subject: "Denuncia Medio Pasaje",
    text: `
    El usuario ${usrNom} ${usrApe} con DNI ${usrDNI} ha realizado una denuncia.
    Medio de transporte: ${denMovPla}
    Razón social: ${denRazSoc}
    Fecha: ${denFec}
    Hora: ${denHor}
    Evidencia: ${denEvi}
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Denuncia Realizada");
  } catch (error) {
    console.error("Hubo un error al enviar el correo de confirmación: ", error);
  }
};

module.exports = { sendConfirmationEmail, sendDenunciaEmail };
