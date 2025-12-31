// Requires
const { DATE } = require("sequelize");
const db = require("../database/models");
const { Op } = require("sequelize");
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const usersController = {
    userList: async (req, res) => {
        let admins = await db.admin.findAll()
        res.render('./users/usersList.ejs', {req, admins})
    },

    userDetail: async (req, res) => {
        let user = await db.user.findByPk(req.params.id,
            {include: [{association:"logs"}]}
        )
        let warn = []
        for (log of user.logs) {
            if (log.logType == "sancion") {
                warn.push(log)
            }
        }
        res.render('./users/usersDetail.ejs' , {req, user, warn})
    },

    storeUser: async (req, res) => {
        await db.admin.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            active: 1
        })
        res.redirect('/users/list')
    },

    updateUser: async (req, res) => {
        let adminToEdit = await db.admin.findByPk(req.params.id)
        let password
        if (req.body.password == "") {
            password = adminToEdit.password
        } else {
            password = bcrypt.hashSync(req.body.password, 10)
        }
        adminToEdit.update({
            password: password,
            active: req.body.active
        })
        res.redirect('/users/list')
    },

    deleteUser: async (req, res) => {
        let userDelete = await db.admin.findByPk(req.params.id)
        await userDelete.destroy();
        res.redirect ('/users/list');
    },

}

module.exports = usersController;
