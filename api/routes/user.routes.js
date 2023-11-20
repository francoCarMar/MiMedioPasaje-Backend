const express = require("express");
const { UserController } = require("../controllers/index.js");

const router = express.Router();

router.post("/register", (req, res) => {
  const userData = req.body;
  UserController.createUser(userData)
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
});

router.post("/login", (req, res) => {
  const { usrEma, usrPas } = req.body;
  UserController.login({ usrEma, usrPas })
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json(err));
});

router.post("/verify", (req, res) => {
  const { usrEma, usrValCod } = req.body;
  UserController.verifyCode({ usrEma, usrValCod })
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json(err));
});

router.post("/generateCode", (req, res) => {
  const code = Math.floor(Math.random() * 1000000);
  res.json({ code });
});

module.exports = router;
