/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = process.env;
const {
  createUser,
  //   getUser,
  //   getUserById,
  getUserByUsername,
} = require("../db");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  const passwordMinLength = 8;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: "UserNameExistsError",
        message: "A user has already claimed this username >:(",
      });
    }

    if (password.length < passwordMinLength) {
      res.send({
        name: "PasswordMustBe8CharactersError",
        message: "Password Needs To Be More Than 8 Characters!",
      });
    } else {
      const user = await createUser({
        username,
        password,
      });

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          password: user.password,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2w",
        }
      );

      res.send({
        message: "Thank you for registering! :)",
        token: token,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
