const Sequelize = require("sequelize");
const sequelize = require("../../database.js");

const Denuncia = sequelize.define(
  "denuncia",
  {
    denCod: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    usrDNI: {
      type: Sequelize.STRING,
      foreignKey: true,
      allowNull: false,
    },
    denRazSoc: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    denMovPla: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    denFec: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    denHor: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    denEvi: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "denuncia",
    timestamps: false,
  }
);

module.exports = Denuncia;
