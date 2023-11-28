const { Denuncia } = require("../models/index.js");
const { sendDenunciaEmail } = require("../services/sendEmail.service.js");

const denunciar = async ({
  usrDNI,
  usrNom,
  usrApe,
  denRazSoc,
  denMovPla,
  denFec,
  denHor,
  denEvi,
}) => {
  try {
    const newDenuncia = await Denuncia.create({
      usrDNI,
      usrNom,
      usrApe,
      denRazSoc,
      denMovPla,
      denFec,
      denHor,
      denEvi,
    });
    await sendDenunciaEmail(
      usrDNI,
      usrNom,
      usrApe,
      denRazSoc,
      denMovPla,
      denFec,
      denHor,
      denEvi
    );

    return { message: "denuncia creada", denuncia: newDenuncia };
  } catch (e) {
    return { message: "error al crear denuncia", error: e };
  }
};

const misDenuncias = async ({ usrDNI }) => {
  try {
    const denuncias = await Denuncia.findAll({ where: { usrDNI: usrDNI } });
    return { message: "denuncias encontradas", denuncias: denuncias };
  } catch (e) {
    console.log(e);
    return { message: "error al buscar denuncias", error: e };
  }
};

module.exports = {
  denunciar,
  misDenuncias,
};
