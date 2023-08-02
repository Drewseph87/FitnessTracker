async function requireUser(req, res, next) {
  if (!req.user) {
    next({
      message: "You must be logged in to perform this action",
      name: "MissingUserError",
      error: "Missing logged in User Error",
    });
  }

  next();
}

module.exports = {
  requireUser,
};
