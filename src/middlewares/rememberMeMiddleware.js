//  Requires
const fs = require('fs');
const path = require('path');

// Lectura de la DB json a formato array de objetos
const usersFilePath = path.join(__dirname, '../data/users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));


function rememberMeMiddleware (req, res, next) {
    if (req.cookies.rememberMe != undefined && req.session.userLogged == undefined) {
        for(user of users){
            if(user.email == req.cookies.rememberMe){
                userToLogin = user;
                break;
            }
        }
        req.session.userLogged = userToLogin;
    }
    next();
};
module.exports = rememberMeMiddleware;