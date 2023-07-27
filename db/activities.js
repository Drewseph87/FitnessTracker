const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    INSERT INTO activities( name, description )
    VALUES($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,
      [name, description]
    );
    // console.log("activity ", activity);
    return activity;
  } catch (error) {
    throw new Error("Activity was not thrown into the table!");
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows: allActivities } = await client.query(`
    SELECT id
    FROM activities;
    `);
    const activities = await Promise.all(
      allActivities.map((activity) => getActivityById(activity.id))
    );
    return activities;
  } catch (error) {
    throw new Error("Couldn't get all Activities!");
  }
}

async function getActivityById(id) {
  try {
    const {
      rows: [activitiesId],
    } = await client.query(
      `
    SELECT *
    FROM activities
    WHERE id=$1;
    `,
      [id]
    );
    if (!activitiesId) {
      throw {
        name: "ActivityIdNotFoundError",
        message: "Could not find an activity with that ActivityId",
      };
    }
    return activitiesId;
  } catch (error) {
    console.log("There is no Activity with this ID!");
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activitiesName],
    } = await client.query(
      `
    SELECT *
    FROM activities
    WHERE name=$1;
    `,
      [name]
    );
    if (!activitiesName) {
      throw {
        name: "ActivityNameNotFoundError",
        message: "Could not find an activity with that name!",
      };
    }
    return activitiesName;
  } catch (error) {
    console.log("There is no Activity with this name!");
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {
  /*try {
    const { rows: activities } = await client.query(`
      SELECT activities.*
      FROM activities
      JOIN routine_activities ON activities.id=routine_activities."routineId"
      WHERE routine_activities."actitivityId"=$1;
    `, [routines]);

    return activities;
  } catch(error){
    throw new Error("cannot attach")
  }*/
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const updateString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  // console.log("updateString: ", updateString);
  try {
    if (updateString.length > 0) {
      await client.query(
        `
      UPDATE activities
      SET ${updateString}
      WHERE id=${id}
      RETURNING *;
      `,
        Object.values(fields)
      );
    }
    return await getActivityById(id);
  } catch (error) {
    throw new Error("Could not update the activity based on it's Id!");
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
