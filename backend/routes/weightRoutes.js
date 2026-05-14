const express = require("express");
const WeightController = require("../controllers/weightController");

const weightRoutes = express.Router();

weightRoutes.post("/", WeightController.addWeight);
weightRoutes.get("/latest", WeightController.getLatestWeight);
weightRoutes.get("/analytics/progress", WeightController.getProgress);
weightRoutes.post("/calculate-bmi", WeightController.calculateBMI);
weightRoutes.get("/range", WeightController.getWeightByDateRange);
weightRoutes.put("/:id", WeightController.updateWeight);
weightRoutes.delete("/:id", WeightController.deleteWeight);

module.exports = weightRoutes;
