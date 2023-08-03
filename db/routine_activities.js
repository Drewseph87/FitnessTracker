const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
    INSERT INTO routine_activities( "routineId", "activityId", duration, count )
    VALUES($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *;
    `,
      [routineId, activityId, duration, count]
    );
    // console.log("routine_activity: ", routine_activity);
    return routine_activity;
  } catch (error) {
    // console.error(error);
    throw new Error("addActivityToRoutine didn't return a routineActivity");
  }
}

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routineActivitiesId],
    } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE id=$1;
    `,
      [id]
    );
    if (!routineActivitiesId) {
      throw {
        name: "RoutineActivityIdNotFoundError",
        message: "Could not find an activity with that RoutineActivityId",
      };
    }
    return routineActivitiesId;
  } catch (error) {
    console.log("There is no routine activity with this ID!");
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routineActivitiesRoutine } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE "routineId"=$1;
    `,
      [id]
    );
    if (!routineActivitiesRoutine) {
      throw {
        name: "RoutineActivityRoutineNotFoundError",
        message: "Could not find an activity with that RoutineActivityRoutine",
      };
    }
    return routineActivitiesRoutine;
  } catch (error) {
    console.log("There is no routine activity with this ROUTINE!");
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const updateString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  // console.log("updateString: ", updateString);
  try {
    if (updateString.length > 0) {
      await client.query(
        `
      UPDATE routine_activities
      SET ${updateString}
      WHERE id=${id}
      RETURNING *;
      `,
        Object.values(fields)
      );
    }
    return await getRoutineActivityById(id);
  } catch (error) {
    throw new Error("Could not update the routine_activity based on it's Id!");
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [destroyActivity],
    } = await client.query(
      `
      DELETE FROM routine_activities
      WHERE id=$1
      RETURNING *;
    `,
      [id]
    );

    return destroyActivity;
  } catch (error) {
    throw new Error("Could not destroy routine activity");
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const { 
      rows: [editActivity],
    } = await client.query(`
      SELECT routine_activities.*, routines."creatorId" AS "routineCreatorId"
      FROM routine_activities
      JOIN routines ON routine_activities."routineId" = routines.id
      WHERE "creatorId" = ${userId} 
      AND routine_activities.id = ${routineActivityId};
    `);

    return editActivity;
  } catch(error) {
    console.log("Unable to edit routine activity");
    return false;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
