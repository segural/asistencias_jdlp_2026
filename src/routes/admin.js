// Requiero los módulos de node que se van ausar:
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Middleware que sólo permite acceder a ciertas rutas si se está loggeado:
const authMiddleware = require("../middlewares/authMiddleware.js");
// const redirectIfLogued = require("../middlewares/redirectIfLogued.js");
// const validateUserLogin = require("../middlewares/validateUserLogin.js");

// Requiero el controller al que apuntan las rutas que defino más abajo:
const adminController = require("../controllers/adminController.js");

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/img/photos/");
    },
    filename: (req, file, cb) => {
        const newImageName = req.params.id + "_" + Date.now() + path.extname(file.originalname);
        cb(null, newImageName);
    },
    });
    const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1000 * 1000 },
    });

// Defino las rutas, es decir que controlador y cuál de sus métodos es el que va a manejar el requerimiento
//Rutas get
router.get("/", adminController.login);
router.get("/index", authMiddleware, adminController.adminindex);
router.get("/admindays", authMiddleware, adminController.listdays);
router.get("/users", authMiddleware, adminController.listadmin);
router.get("/edit/:id", authMiddleware, adminController.editday);
router.get("/detail/:id", authMiddleware, adminController.detailday);
router.get("/userdetail/:id", authMiddleware, adminController.userdetail);

//Rutas post/put
router.post("/login", adminController.loginProcess);
router.post("/logout", adminController.logoutProcess);
router.post("/add", adminController.addaday);
router.post("/changepoints/:id", adminController.changepoints);
router.put("/update/:id", upload.single("attach"), adminController.updateday);
router.put("/destroy/:id", adminController.deleteday);

//Rutas delete

module.exports = router;