const express = require("express");
const { getExercises, createExercise, removeExercise } = require("../controllers/exerciseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", authMiddleware, getExercises);
router.post("/", authMiddleware, createExercise);
router.delete("/:id", authMiddleware, removeExercise);

module.exports = router;
