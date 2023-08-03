require("dotenv").config();
const express = require("express");
const router = express.Router();

const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
  destroyRoutine,
  getRoutineActivitiesByRoutine,
  addActivityToRoutine,
  getRoutineActivityById,
} = require("../db");
const { requireUser } = require("./utils.js");

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();

    res.send(routines);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  const { id } = req.user;
  const { isPublic, name, goal } = req.body;
  //   console.log(req);

  try {
    const creatorId = id;
    const creatingRoutine = await createRoutine({
      creatorId,
      isPublic,
      name,
      goal,
    });
    res.send(creatingRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const { id } = req.user;
  const { isPublic, name, goal } = req.body;

  try {
    const theRoutine = await getRoutineById(routineId);
    // console.log(theRoutine);
    if (theRoutine.creatorId === id) {
      const updatingRoutine = await updateRoutine({
        id: routineId,
        ...req.body,
      });

      res.send(updatingRoutine);
    } else {
      res.status(403).send({
        name: "403Error",
        message: `User ${req.user.username} is not allowed to update Every day`,
        error: "Error",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/routines/:routineId
router.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const { id } = req.user;
  const { isPublic, name, goal } = req.body;

  try {
  const theRoutine = await getRoutineById(routineId);
  if (theRoutine.creatorId === id) {
    const deleteRoutine = await destroyRoutine({
      id: routineId,
    });

    res.send(deleteRoutine);
  } else {
    res.status(403).send({
      name: "403Error",
      message: `User ${req.user.username} is not allowed to delete On even days`,
      error: "Error",
    });
  }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  //const { id } = req.user;
  const { duration, count, activityId } = req.body;

  try {  
    const routineActivitiesId = await getRoutineActivityById(activityId);
    if(routineActivitiesId) {
      next({
        name: "DuplicateIdError",
        message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
      });
    } else {
      const newActivity = await addActivityToRoutine({
        routineId,
        duration,
        count,
        activityId,
      });
      res.send(newActivity);
    }

    return newActivity;
  } catch({ name, message }) {
    next({ name, message });
  }
});


module.exports = router;