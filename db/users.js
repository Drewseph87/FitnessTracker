const client = require("./client");
const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `,
      [username, hashedPassword]
    );
    // console.log("user: ", user);
    delete user.password;
    return user;
  } catch (error) {
    throw new Error("Error creating user!");
  }
}

async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  // isValid will be a boolean based on wether the password matches the hashed password
  const isValid = await bcrypt.compare(password, hashedPassword);
  if (!isValid) {
    return false;
  } else {
    delete user.password;
    return user;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, username, password
      FROM users
      WHERE id=${userId}
      `
    );
    if (!user) {
      return null;
    } else {
      delete user.password;
    }
    return user;
  } catch (error) {
    console.log("Error, can't get User by ID!");
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE username=$1;
      `,
      [username]
    );

    console.log("This is from getUserByUsername", user);
    return user;
  } catch (error) {
    console.log("Couldn't get user by USERNAME!");
  }
}
module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
