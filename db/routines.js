const client = require("./client");
// const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    INSERT INTO routines( "creatorId", "isPublic", name, goal )
    VALUES($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );
    // console.log("routines: ", routine);
    return routine;
  } catch (error) {
    throw new Error("Routine was not thrown into the database!");
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routinesId],
    } = await client.query(
      `
    SELECT *
    FROM routines
    WHERE id=$1;
    `,
      [id]
    );
    if (!routinesId) {
      throw {
        name: "RoutinesIdNotFoundError",
        message: "Could not find an activity with that RoutinesId",
      };
    }
    return routinesId;
  } catch (error) {
    console.log("There is no Routine with this ID!");
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routinesWithoutActivities } = await client.query(`
    SELECT id
    FROM routines
      `);
    const routines = await Promise.all(
      routinesWithoutActivities.map((routine) => getRoutineById(routine.id))
    );

    // console.log("Routines_Without_Activities: ", routines);
    return routines;
  } catch (error) {
    throw new Error("Couldn't grab all routines!");
  }
}

async function getAllRoutines() {
  try {

  } catch(error) {
    throw new Error("Error getting routines");
  }
}

async function getAllPublicRoutines() {
/*  try {
    const { rows: routines } = await client.query(`
      SELECT id
      FROM routines
    `);
    const routines = await Promise.all(
      routinesWithoutActivities.map((routine) => getRoutineById(routine.id))
    );

  } catch(error) {
    throw new Error("Error getting publice routines");
  }
}*/
}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {
  const updateString = Object.keys(fields)
  .map((key, index) => `"${key}"=$${index + 1}`)
  .join(", ");

  try{
    if (updateString.length > 0) {
      await client.query(`
      UPDATE routines
      SET ${updateString}
      WHERE id=${id}
      RETURNING *;
      `,
        Object.values(fields)
      );
    }
    return await getRoutineById(id);
  } catch(error) {
    throw new Error("Could not update Routine");
  }
}

async function destroyRoutine(id) {
  try {    
    await client.query(`
      DELETE FROM routine_activities
      WHERE "routineId"=$1
      RETURNING *;
    `, [id]);
    const {
      rows: [destroyRoutine],
    } = await client.query(`
      DELETE FROM routines
      WHERE id=$1
      RETURNING *;
    `, [id]);


    return destroyRoutine;
  } catch(error) {
    throw new Error("Could not destroy routine");
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
