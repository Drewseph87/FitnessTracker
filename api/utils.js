async function requireUser(req, res, next) {
  if (!req.user) {
    // console.log(req.user);
    res.send({
      error: "Missing logged in User Error",
      message: "You must be logged in to perform this action",
      name: "MissingUserError",
    });
  } else {
    next();
  }
}

module.exports = {
  requireUser,
};