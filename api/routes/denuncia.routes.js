const express = require("express");
const { DenunciaController } = require("../controllers/index.js");
// const { filtrateStatus } = require("../services/readEmail.service.js");

const router = express.Router();

router.post("/denunciar", (req, res) => {
  const denunciaData = req.body;
  DenunciaController.denunciar(denunciaData)
    .then((denuncia) => res.json(denuncia))
    .catch((err) => res.status(500).json(err));
});
router.post("/denuncias", (req, res) => {
  const usrData = req.body;
  DenunciaController.misDenuncias(usrData)
    .then((denuncias) => res.json(denuncias))
    .catch((err) => res.status(500).json(err));
});

/*
router.post("/statusDenuncia", (req, res) => {
  const { usrDNI } = req.body;
  filtrateStatus(usrDNI)
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json(err));
});
*/

module.exports = router;
