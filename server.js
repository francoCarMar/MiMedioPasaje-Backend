const express = require("express");
const { userRouter, denunciaRouter } = require("./api/routes/index.js");
const sequelize = require("./database.js");

const app = express();

app.use(express.json());

app.use("/", userRouter);
app.use("/", denunciaRouter);

sequelize
  .sync()
  .then(() => {
    console.log("Tablas sincronizadas");
  })
  .catch((e) => {
    console.log("Error al sincronizar las tablas", e);
  });

app.listen(3000, () => {
  console.log("App listen on port 3000");
});
