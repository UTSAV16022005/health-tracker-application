const express = require("express");
const ActivityController = require("../controllers/activityController");

const activityRoutes = express.Router();

activityRoutes.post("/", ActivityController.createActivity);
activityRoutes.get("/daily", ActivityController.getDailyActivity);
activityRoutes.get("/analytics/weekly", ActivityController.getWeeklySummary);
activityRoutes.get("/range", ActivityController.getActivityByDateRange);
activityRoutes.put("/:id", ActivityController.updateActivity);
activityRoutes.delete("/:id", ActivityController.deleteActivity);

module.exports = activityRoutes;
