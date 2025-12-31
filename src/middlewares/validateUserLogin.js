const {check} = require("express-validator");
let validateUserLogin = [
    check("user")
        .notEmpty().withMessage("Debes introducir un usuario").bail(),
        
    check("password")
        .notEmpty().withMessage("Debes introducir una contraseña").bail()
];

module.exports = validateUserLogin;