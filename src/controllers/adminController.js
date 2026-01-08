// Requires
const { DATE } = require("sequelize");
const db = require("../database/models");
const { Op } = require("sequelize");
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const adminController = {
    login: (req, res) => {
        res.render("./admin/login.ejs", { req });
    },

    loginProcess: async (req, res) => {
        let errors = validationResult(req);        
        let userToLogin = undefined;
        if (errors.isEmpty()) {
            let user = await db.admin.findOne({
                where: {
                    username: req.body.user
                    }
            });
            if (user != null) {
                if (user.active == true) {
                    if (bcrypt.compareSync(req.body.password, user.password)) {
                            userToLogin = user;
                    };
                } else {
                    return res.render ('./admin/login', {errors:{ noUser:
                        {msg: "Admin Deshabilitado"}
                    }, old: req.body, req}); 
                };
            }              
        } else {
            return res.render ('./admin/login', {errors:errors.mapped(), old: req.body, req});
    };
    if (userToLogin == undefined){
        return res.render ('./admin/login', {errors:{ noUser:
            {msg: "Credenciales inválidas"}
        }, old: req.body, req});
    };
    req.session.userLogged = userToLogin;
    if (req.body.rememberMe != undefined){
        res.cookie("rememberMe", userToLogin.user, {maxAge: 120000})
    };
    res.redirect("/admin/index");
    },

    adminindex: async (req, res) => {
        let users = await db.user.findAll({
            order: [
                ['point', 'DESC'],
            ],
        })
        let days = await db.day.findAll({
            where: {active: 0}
        });
        let i = 0
        res.render("./admin/adminIndex.ejs", { req, users, i, days });
    },

    listdays: async (req, res) => {
        let days = await db.day.findAll();
        res.render("./admin/adminListDays.ejs", { req, days });
    },

    addaday: async (req, res) => {
        let description
        if (req.body.description == "") {
            description = null
        } else {
            description = req.body.description
        }
        let points
        if (req.body.type == "Jueves"){
            points = 2
        } else if (req.body.type == "Cumpleaños"){
            points = 2
        } else if (req.body.type == "Evento Especial") {
            points = req.body.specialPoints
        }
        let day = await db.day.create({
            date: req.body.date,
            type: req.body.type,
            sede: req.body.sede,
            description: description,
            pointsAsigned: points,
            active: 1
        })
        res.redirect ('/admin/admindays');
    },

    deleteday: async (req, res) => {
        let dayDelete = await db.day.findByPk(req.params.id)
        await dayDelete.destroy();
        res.redirect ('/admin/admindays');
    },

    editday: async (req, res) => {
        let users = await db.user.findAll({
            order: [
                ['point', 'DESC'],
            ],
        });
        let dayToEdit = await db.day.findByPk(req.params.id,
			{include: [
				{association:"presents"}				
			]});
        res.render("./admin/editDays.ejs", {req, dayToEdit, users})
    },

    updateday: async (req, res) => {
        let dayToUpdate = await db.day.findByPk(req.params.id);
        let users = await db.user.findAll();
        let presents = req.body.presents;
        let absents = await db.user.findAll()
        for (absent of absents) {
            for (i = 0; i < presents.length; i++){
                if (absent.id == presents[i]){
                    let indice = absents.indexOf(absent)
                    delete absents[indice]
                }
            }
        }
        dayToUpdate.update({
            active: 0,
            photo: req.file.filename,
        })
        await dayToUpdate.addPresents(req.body.presents);
        if (dayToUpdate.type == "Jueves") {
            for (i = 0; i < presents.length; i++){
                for (user of users) {
                    if (user.id == presents[i]) {
                        user.update({
                            pres_thursday: user.pres_thursday + 1,
                            point: user.point + dayToUpdate.pointsAsigned,
                            present: user.present + 1,
                        })
                        await user.createLog({adminid: req.session.userLogged.id, logType:"Asistencia", action:"Asistencia a un jueves", points: "+2", eventdate: dayToUpdate.date})
                    }
                }
            }
            for (absent of absents) {
                if (absent != undefined) {
                    absent.update({
                        abs_thursday: absent.abs_thursday + 1,
                        absent: absent.absent + 1,
                    })
                await absent.createLog({adminid: req.session.userLogged.id, logType:"Falta", action:"Falta a un jueves", points: "0", eventdate: dayToUpdate.date})
                }
            }
        } else if (dayToUpdate.type == "Cumpleaños") {
            for (i = 0; i < presents.length; i++){
                for (user of users) {
                    if (user.id == presents[i]) {
                        user.update({
                            pres_birth: user.pres_birth + 1,
                            point: user.point + dayToUpdate.pointsAsigned,
                            present: user.present + 1,
                        })
                    await user.createLog({adminid: req.session.userLogged.id, logType:"Asistencia", action:"Asistencia a cumpleaños", points: "+4", eventdate: dayToUpdate.date})
                    }
                }
            }
            for (absent of absents) {
                if (absent != undefined) {
                    absent.update({
                        abs_birth: absent.abs_birth + 1,
                        absent: absent.absent + 1,
                    })
                await absent.createLog({adminid: req.session.userLogged.id, logType:"Falta", action:"Falta a cumpleaños", points: "0", eventdate: dayToUpdate.date})
                }
            }
        } else if (dayToUpdate.type == "Evento Especial") {
            for (i = 0; i < presents.length; i++){
                for (user of users) {
                    if (user.id == presents[i]) {
                        user.update({
                            pres_special: user.pres_special + 1,
                            point: user.point + dayToUpdate.pointsAsigned,
                            present: user.present + 1,
                        })
                    await user.createLog({adminid: req.session.userLogged.id, logType:"Asistencia", action:"Asistencia a evento especial", points: "+"+dayToUpdate.pointsAsigned, eventdate: dayToUpdate.date})
                    }
                }
            }
            for (absent of absents) {
                if (absent != undefined) {
                    absent.update({
                        abs_special: absent.abs_special + 1,
                        absent: absent.absent + 1,
                    })
                await absent.createLog({adminid: req.session.userLogged.id, logType:"Falta", action:"Falta a evento especial", points: "0", eventdate: dayToUpdate.date})
                }
            }
        }
        res.redirect ('/admin/admindays');
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
        res.render("./admin/adminDayDetail.ejs", { req, absents, day });
    },

    userdetail: async (req, res) => {
        let user = await db.user.findByPk(req.params.id,
            {include: [{association:"logs"}]}
        )
        let warn = []
        for (log of user.logs) {
            if (log.logType == "sancion") {
                warn.push(log)
            }
        }
        res.render('./admin/adminUsersDetail.ejs' , {req, user, warn})
    },
    
    listadmin: async (req, res) => {
        let users = await db.user.findAll({
            order: [
                ['point', 'DESC'],
            ],
        })
        let days = await db.day.findAll();
        let i = 0
        res.render("./admin/adminIndex.ejs", { req, users, i, days });
    },

    changepoints: async (req, res) => {
        let usertochange = await db.user.findByPk(req.params.id)
        if (req.body.action == "plus") {
            let point = parseInt(usertochange.point) + parseInt(req.body.points)
            let award = parseInt(usertochange.award) + parseInt(req.body.points)
            usertochange.update({
                point: point,
                award: award,
            })
        await usertochange.createLog({adminid: req.session.userLogged.id, logType:"Premio", action: req.body.description, points: "+" + req.body.points, eventdate: req.body.date})
        } else {
            let point = parseInt(usertochange.point) - parseInt(req.body.points)
            let penalty = parseInt(usertochange.penalty) + parseInt(req.body.points)
            usertochange.update({
                point: point,
                penalty: penalty,
            })
        await usertochange.createLog({adminid: req.session.userLogged.id, logType:"Castigo", action: req.body.description, points: "-" + req.body.points, eventdate: req.body.date})
        }
        res.redirect('/admin/userdetail/'+usertochange.id)
    },

    logoutProcess: (req, res) => {        
        req.session.destroy();
        res.cookie("rememberMe", "", {maxAge: -1});
        res.redirect ('/');
    },
}

module.exports = adminController;
