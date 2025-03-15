const pool = require("../config/db");

const getAllExercises = async (userId) => {
  return pool.query("SELECT * FROM exercises WHERE user_id = $1", [userId]);
};

const addExercise = async (userId, name, duration) => {
  return pool.query(
    "INSERT INTO exercises (user_id, name, duration) VALUES ($1, $2, $3) RETURNING *",
    [userId, name, duration]
  );
};

const deleteExercise = async (exerciseId, userId) => {
  return pool.query("DELETE FROM exercises WHERE id = $1 AND user_id = $2", [exerciseId, userId]);
};

module.exports = { getAllExercises, addExercise, deleteExercise };
