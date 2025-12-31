// Requires
const { DATE } = require("sequelize");
const db = require("../database/models");
const { Op } = require("sequelize");
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const mainController = {

    index: async (req, res) => {
        let users = await db.user.findAll({
            order: [
                ['point', 'DESC'],
            ],
        })
        let days = await db.day.findAll({
            where: {active: 0}
        });
        let i = 0
        res.render("./main/index.ejs", { req, users, i, days });
    },

    showyear: async (req, res) => {
        let year = req.params.year
        let table = db["user_"+year]
        let users = await table.findAll({
            order: [
                ['point', 'DESC'],
            ],
        })
        let i = 0
        res.render("./main/historical.ejs", { req, users, i, year });
    },

    listdays: async (req, res) => {
        let tipo
        if (req.params.type == "thursday") {
            tipo = "Jueves"
        } else if (req.params.type == "birthday") {
            tipo = "Cumpleaños"
        } else if (req.params.type == "special") {
            tipo = "Evento Especial"
        }
        let days = await db.day.findAll({
            where: {type: tipo}
        })
        res.render("./main/listDays.ejs", {req, days})
    },

    detailday: async (req, res) => {
        let day = await db.day.findByPk(req.params.id,
            {include: [{association:"presents"}]}
        )
        let absents = await db.user.findAll()
        for (absent of absents) {
            for (i = 0; i < day.presents.length; i++){
                if (absent.id == day.presents[i].id){
                    let indice = absents.indexOf(absent)
                    delete absents[indice]
                }
            }
        }
        res.render("./main/dayDetail.ejs", { req, absents, day });
    },

    rules: (req, res) => {
        res.render("./main/rules.ejs", { req });
    },

}

module.exports = mainController;
