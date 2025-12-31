// Requiero los módulos de node que se van ausar:
const express = require("express");
const router = express.Router();

// Middleware que sólo permite acceder a ciertas rutas si se está loggeado:
const authMiddleware = require("../middlewares/authMiddleware.js");
const redirectIfLogued = require("../middlewares/redirectIfLogued.js");
const validateUserLogin = require("../middlewares/validateUserLogin.js");

// Requiero el controller al que apuntan las rutas que defino más abajo:
const usersController = require("../controllers/usersController.js");

// Defino las rutas, es decir que controlador y cuál de sus métodos es el que va a manejar el requerimiento
//Rutas get
router.get("/list", usersController.userList);
router.get("/detail/:id", usersController.userDetail);

//Rutas post/put
router.post("/add", usersController.storeUser);
router.put("/update/:id", usersController.updateUser);

//Rutas delete
router.put("/destroy/:id", usersController.deleteUser);

module.exports = router;