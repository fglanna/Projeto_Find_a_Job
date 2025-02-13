const express = require("express");
const app = express();
const db = require("./db/connection.js");

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`o Express está rodando na porta ${PORT}`);
});

// db connection
db.authenticate()
  .then(() => {
    console.log("Conectou ao banco com sucesso");
  })
  .catch((err) => {
    console.log("Ocorreu um erro ao conectar", err);
  });

// routes
app.get("/", (req, res) => {
  res.send("Está Funcionando!");
});
