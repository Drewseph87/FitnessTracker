require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
  createUser,
  getUser,
  //   getUserById,
  getUserByUsername,
} = require("../db");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  //console.log("req.body: ", req.body);
  const { username, password } = req.body;
  const passwordMinLength = 8;

  // try {
  const _user = await getUserByUsername(username);

  if (_user) {
    console.log("LINE 24 in USERS/API", _user);
    next({
      name: "UserNameExistsError",
      message: `A user has already claimed this username, ${username} >:(`,
    });
  }

  if (password.length < passwordMinLength) {
    console.log("password", password);
    next({
      name: "PasswordMustBe8CharactersError",
      message: "Password Needs To Be More Than 8 Characters!",
    });
  } else {
    const user = await createUser({
      username,
      password,
    });

    console.log("what is this exactly,", process.env.JWT_SECRET);
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
    console.log("Line 52 is this part here!");
    // console.log("responseBodyinCode: ", res.body);

    res.send({
      message: "Thank you for registering! :)",
      token: token,
      user: {
        id: user.id,
        username,
      },
    });
    //   }
    // } catch ({ name, message }) {
    //   console.log("This is line 66 in Catch section", { name, message });
    //   next({ name, message });
    // }
  }
});

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
