const { getAllExercises, addExercise, deleteExercise } = require("../models/exerciseModel");

exports.getExercises = async (req, res) => {
  try {
    const exercises = await getAllExercises(req.user.id);
    res.json(exercises.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
};

exports.createExercise = async (req, res) => {
  const { name, duration } = req.body;
  try {
    const newExercise = await addExercise(req.user.id, name, duration);
    res.json(newExercise.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to add exercise" });
  }
};

exports.removeExercise = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteExercise(id, req.user.id);
    res.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete exercise" });
  }
};
