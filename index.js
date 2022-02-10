const PORT = 8080;

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
// DATABASE

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso ao bando de dados!");
    })
    .catch((err) => {
        console.log("Conexão falhou: " + err);
    });

//importa o EJS como View Engine no Express
app.set("view engine", "ejs");
app.use(express.static("public"));

//importa body-parser para o express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Rotas
app.get("/", (req, res) => {
    Pergunta.findAll({
        raw: true,
        order: [
            ["id", "DESC"], // ASC = CRESCENTE // DESC = DECRESCENTE
        ],
    }).then((perguntas) => {
        res.render("index", {
            perguntas: perguntas,
        });
    });
});
app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});
app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var desc = req.body.desc;
    Pergunta.create({
        titulo: titulo,
        desc: desc,
    })
        .then(() => {
            res.redirect("/");
        })
        .catch(() => {
            res.send("Houve um erro ao salvar os dados");
        });
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({ where: { id: id } })
        .then((pergunta) => {
            if (pergunta) {
                Resposta.findAll({ where: { perguntaId: pergunta.id } }).then(
                    (respostas) => {
                        res.render("pergunta", {
                            pergunta: pergunta,
                            respostas: respostas,
                        });
                    }
                );
            } else {
                res.redirect("/");
            }
        })
        .catch(() => {
            res.send("ERROR");
        });
});
app.post("/responder", (res, req) => {
    var corpo = req.body.corpo;
    var pergunta = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: pergunta,
    })
        .then(() => {
            res.redirect("/pergunta/" + pergunta);
        })
        .catch((err) => {
            res.send(err);
        });
});
app.listen(PORT, () => {
    console.log("App rodando");
});
