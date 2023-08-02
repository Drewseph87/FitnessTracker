require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { requireUser } = require("./utils.js");
//const { JWT_SECRET } = process.env;

const {
  createUser,
  getUser,
  //   getUserById,
  getUserByUsername,
  getPublicRoutinesByUser,
} = require("../db");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  //console.log("req.body: ", req.body);
  const { username, password } = req.body;
  const passwordMinLength = 8;
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      //console.log("LINE 24 in USERS/API", _user);
      res.send({
        name: "UserNameExistsError",
        message: `User ${username} is already taken.`,
        error: "",
      });
    }
    if (password.length < passwordMinLength) {
      //console.log("password", password);
      res.send({
        name: "PasswordMustBe8CharactersError",
        message: "Password Too Short!",
        error: "",
      });
    } else {
      const user = await createUser({
        username,
        password,
      });
      //console.log("what is this exactly,", process.env.JWT_SECRET);
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2w",
        }
      );
      //console.log("Line 52 is this part here!");
      // console.log("responseBodyinCode: ", res.body);
      res.send({
        message: "Thank you for registering! :)",
        token: token,
        user: {
          id: user.id,
          username,
        },
      });
    }
  } catch ({ name, message }) {
    //console.log("This is line 66 in Catch section", { name, message });
    next({ name, message });
  }
});

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingInfoError",
      message: "Please enter both username and password.",
    });
  }
  try {
    const user = await getUserByUsername(username, password);
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET);
    if (!user && !user.password == !hashedPassword) {
      res.send({
        name: "WrongInfoError",
        message: "Username or password is incorrect.",
      });
    } else {
      res.send({
        message: "you're logged in!",
        token: token,
        user: {
          id: user.id,
          username,
        },
      });
    }
  } catch (error) {
    console.log("unable to log in");
    next(error);
  }
});

// GET /api/users/me
router.get("/me", requireUser, async (req, res, next) => {
  const { username } = req.params;

  try {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "2w",
    });
    const user = await getUser({ username, token });

    if (!token) {
      next({
        message: "Incorrect Info",
      });
      res.send({ user });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;
});

module.exports = router;
