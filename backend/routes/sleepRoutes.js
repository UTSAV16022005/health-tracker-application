const express = require("express");
const SleepController = require("../controllers/sleepController");

const sleepRoutes = express.Router();

sleepRoutes.post("/", SleepController.recordSleep);
sleepRoutes.get("/date", SleepController.getSleepByDate);
sleepRoutes.get("/analytics/weekly", SleepController.getWeeklyAnalytics);
sleepRoutes.get("/range", SleepController.getSleepByDateRange);
sleepRoutes.put("/:id", SleepController.updateSleep);
sleepRoutes.delete("/:id", SleepController.deleteSleep);

module.exports = sleepRoutes;
