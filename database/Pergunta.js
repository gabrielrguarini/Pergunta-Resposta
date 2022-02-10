const Sequelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define("perguntas", {
    titulo: { type: Sequelize.STRING, allowNull: false },
    desc: { type: Sequelize.TEXT, allowNull: false },
});

//Pergunta.sync({ force: true }).then(() => {}); // USADO PARA CRIAR A TABELA NA PRIMEIRA VEZ

module.exports = Pergunta;
