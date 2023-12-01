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
    const { denCod } = await sendDenunciaEmail(
      usrDNI,
      usrNom,
      usrApe,
      denRazSoc,
      denMovPla,
      denFec,
      denHor,
      denEvi
    );
    const newDenuncia = await Denuncia.create({
      denCod,
      usrDNI,
      usrNom,
      usrApe,
      denRazSoc,
      denMovPla,
      denFec,
      denHor,
      denEvi,
    });
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

const setDenuncia = async ({ denCod, denEst }) => {
  try {
    const denuncia = await Denuncia.update(
      { denEst: denEst },
      { where: { denCod: denCod } }
    );
    return { message: "denuncia actualizada", denuncia: denuncia };
  } catch (e) {
    console.log(e);
    return { message: "error al actualizar denuncia", error: e };
  }
};

module.exports = {
  denunciar,
  misDenuncias,
  setDenuncia,
};
