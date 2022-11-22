function guardRoute(req, res, next) {
  if (!res.locals.isAuth) {
    return res.redirect("/401");
  }

  next();
  // This will pass the request to the next middleware in line if the user is authenticated.
}

module.exports = guardRoute;
