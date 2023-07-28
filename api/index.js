const express = require("express");
const router = express.Router();

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

module.exports = router;
