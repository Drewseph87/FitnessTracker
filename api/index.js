require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { getUserById } = require("../db");

// GET /api/health // health check
router.get("/health", async (req, res) => {
  res.status(200).json({ message: "It is healthy" });
});

//GET /api/unknown // 404 Response Error
router.get("/unknown", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ROUTER: /api/users
const usersRouter = require("./users");
router.use("/users", usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require("./activities");
router.use("/activities", activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require("./routines");
router.use("/routines", routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require("./routineActivities");
router.use("/routine_activities", routineActivitiesRouter);

//ROUTER: Authorization for API
router.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        next();
      } else if (!id) {
        next({
          message: "Authorization incorrect.",
        });
      }
    } catch ({ message }) {
      next(message);
    }
  }
});

module.exports = router;
