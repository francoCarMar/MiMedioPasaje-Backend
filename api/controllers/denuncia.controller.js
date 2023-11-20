const { Denuncia } = require("../models/index.js");

const denunciar = async ({
  usrDNI,
  denRazSoc,
  denMovPla,
  denFec,
  denHor,
  denEvi,
}) => {
  try {
    const newDenuncia = await Denuncia.create({
      usrDNI,
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

module.exports = {
  denunciar,
  misDenuncias,
};
