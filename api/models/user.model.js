const Sequelize = require("sequelize");
const sequelize = require("../../database.js");

const User = sequelize.define(
  "user",
  {
    usrDNI: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    usrNom: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    usrApe: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    usrEma: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    usrPas: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    usrImgCar: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    usrImgDNI: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    usrValCod: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    usrVal: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "user",
    timestamps: false,
  }
);

module.exports = User;
