const { User } = require("../models/index.js");
const bcrypt = require("bcrypt");
const { sendConfirmationEmail } = require("../services/sendEmail.service.js");
const e = require("express");

const createUser = async ({
  usrDNI,
  usrNom,
  usrApe,
  usrEma,
  usrPas,
  usrImgCar,
  usrImgDNI,
}) => {
  try {
    const existingUserDNI = await User.findOne({ where: { usrDNI: usrDNI } });
    const existingUserEmail = await User.findOne({ where: { usrEma: usrEma } });
    let errors = [];
    if (existingUserDNI) {
      errors.push("DNI");
    }
    if (existingUserEmail) {
      errors.push("Email");
    }
    if (errors.length > 0) {
      throw new Error(errors.join(","));
    }
    const hashedPassword = await bcrypt.hash(usrPas, 10);
    const confirmationCode = Math.floor(Math.random() * 1000000);

    const newUser = await User.create({
      usrDNI,
      usrNom,
      usrApe,
      usrEma,
      usrPas: hashedPassword,
      usrImgCar,
      usrImgDNI,
      usrValCod: confirmationCode,
    });
    await sendConfirmationEmail(usrEma, confirmationCode);
    return { message: "usuario creado", user: newUser, registered: true };
  } catch (e) {
    return {
      message: e.message,
      registered: false,
    };
  }
};

const login = async ({ usrEma, usrPas }) => {
  try {
    const user = await User.findOne({ where: { usrEma: usrEma } });
    if (!user) {
      throw new Error("Email");
    } else if (!(await bcrypt.compare(usrPas, user.usrPas))) {
      throw new Error("Password");
    }
    return {
      success: true,
      message: "Login successful",
      user: user,
      access: true,
    };
  } catch (e) {
    return { message: e.message, access: false };
  }
};

const changePassword = async ({ usrEma, usrPas }) => {
  try {
    const user = await User.findOne({ where: { usrEma: usrEma } });
    if (user.length == 0) {
      throw new Error("User not found");
    }
    user.Pas = usrPas;
    await user.save();
    return { message: "contraseña cambiada", user: user };
  } catch (e) {
    return { message: "error al cambiar la contraseña", error: e };
  }
};

const verifyCode = async ({ usrEma, usrValCod }) => {
  try {
    const user = await User.findOne({ where: { usrEma: usrEma } });
    if (!user) {
      throw new Error("User not found");
    } else if (user.usrValCod === usrValCod) {
      user.usrVal = true;
      user.usrValCod = null;
      await user.save();
      return { message: "user verified", user: user };
    } else {
      return { message: "invalid code" };
    }
  } catch (e) {
    return { message: "error al verificar el usuario", error: e };
  }
};

module.exports = {
  createUser,
  login,
  verifyCode,
  changePassword,
};
