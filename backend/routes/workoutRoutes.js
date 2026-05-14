const express = require("express");
const WorkoutController = require("../controllers/workoutController");

const workoutRoutes = express.Router();

workoutRoutes.post("/", WorkoutController.createWorkout);
workoutRoutes.get("/", WorkoutController.getWorkouts);
workoutRoutes.get("/analytics/weekly", WorkoutController.getWeeklyAnalytics);
workoutRoutes.get("/:id", WorkoutController.getWorkout);
workoutRoutes.put("/:id", WorkoutController.updateWorkout);
workoutRoutes.delete("/:id", WorkoutController.deleteWorkout);

module.exports = workoutRoutes;
