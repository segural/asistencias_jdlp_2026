function userLoggedMiddleware(req, res, next) {
  if (req.session.userLogged != undefined) {
    res.locals.userLogged = req.session.userLogged;
  } else {
    res.locals.userLogged = null;
  }
  next();
}
module.exports = userLoggedMiddleware;
