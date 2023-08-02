require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getActivityById,
  updateActivity,
  getPublicRoutinesByActivity,
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
  // console.log("PARAMS", req.params);
  // console.log("REQ BODY", req.body);

  try {
    const originalActivity = await getActivityById(activityId);
    const originalName = await getActivityByName(name);

    if (!originalActivity) {
      res.send({
        message: `Activity ${activityId} not found`,
        name: "ActivityIdDoesn'tExistError",
        error: `ERROR finding this activity ID, ${activityId}`,
      });
    } else if (originalName && originalName.name === name) {
      res.send({
        message: `An activity with name ${name} already exists`,
        name: "ActivityNameDoesn'tExistError",
        error: `ERROR finding this activity name,  ${name}`,
      });
    } else {
      const updatedActivity = await updateActivity({
        id: activityId,
        name: name,
        description: description,
      });
      console.log("UpdatedActivityInfo: ", updatedActivity);
      res.send(updatedActivity);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// // GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  try {
    const activityParamId = await getActivityById(activityId);
    console.log("WHAT IS THIS!!!!: ", activityParamId);

    if (activityParamId) {
      const activityRoutines = await getPublicRoutinesByActivity({
        id: activityId,
      });
      console.log(
        "Looking for ActivityID through Routines: ",
        activityRoutines
      );

      res.send(activityRoutines);
    } else {
      res.send({
        message: `Activity ${activityId} not found`,
        name: "ActivityParamIdDoesn'tExistError",
        error: `Error finding Activity Id, ${activityParamId}`,
      });
    }
  } catch ({ name, message }) {
    ({ name, message });
  }
});

module.exports = router;
