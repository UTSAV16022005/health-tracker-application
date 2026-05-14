const express = require("express");
const WaterController = require("../controllers/waterController");

const waterRoutes = express.Router();

waterRoutes.post("/", WaterController.addWater);
waterRoutes.get("/daily", WaterController.getDailyIntake);
waterRoutes.get("/analytics/weekly", WaterController.getWeeklyAnalytics);
waterRoutes.get("/range", WaterController.getIntakeByDateRange);
waterRoutes.delete("/:id", WaterController.deleteEntry);

module.exports = waterRoutes;
