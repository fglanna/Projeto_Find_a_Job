const express = require("express");
const { create } = require("express-handlebars");
const app = express();
const path = require("path");
const db = require("./db/connection.js");
const bodyParser = require("body-parser");
const Job = require("./models/Job.js");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const PORT = 3000;

const hsb = create({
  defaultLayout: "main",
});

app.listen(PORT, () => {
  console.log(`o Express está rodando na porta ${PORT}`);
});

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

// handle bars
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", hsb.engine);
app.set("view engine", "handlebars");

// static folder
app.use(express.static(path.join(__dirname, "public")));

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
  let search = req.query.job;
  let query = search ? "%" + search + "%" : ""; // se digitar PH vem o resultado de PHP, Word -> Wordpress, press -> Wordpress

  if (!search) {
    Job.findAll({ order: [["createdAt", "DESC"]] }).then((jobs) => {
      res.render("index", {
        jobs,
      });
    });
  } else {
    Job.findAll({
      where: { title: { [Op.like]: query } },
      order: [["createdAt", "DESC"]],
    }).then((jobs) => {
      console.log("Search:", search);

      res.render("index", {
        jobs,
        search,
      });
    });
  }
});

// jobs routes
app.use("/jobs", require("./routes/jobs.js"));
