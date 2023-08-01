require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getActivityById,
} = require("../db");

// GET /api/activities
router.get("/", async (req, res, next) => {
  const activities = await getAllActivities();

  res.send(activities);
});

// POST /api/activities
router.post("/", async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const _activity = await getActivityByName(name);

    if (_activity) {
      res.send({
        message: `An activity with name Push Ups already exists`,
        name: "ActivityNameExistsError",
        error: "Error creating activity!",
      });
    } else {
      const activity = await createActivity({
        name,
        description,
      });

      res.send({
        activity,
        description,
        name,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// // PATCH /api/activities/:activityId
router.patch("/:activityId", async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;

  const updatedFields = {};

  if (name) {
    updatedFields.name = name;
  }

  if (description) {
    updatedFields.description = description;
  }

  //   try {
  const originalActivity = await getActivityById(activityId);

  // if(originalActivity. )
  //   } catch {}
});

// // GET /api/activities/:activityId/routines
// router.get("/:activiyId/routines", async (req, res, next) => {});

module.exports = router;
