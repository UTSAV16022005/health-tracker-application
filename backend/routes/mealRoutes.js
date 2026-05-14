const express = require("express");
const MealController = require("../controllers/mealController");

const mealRoutes = express.Router();

mealRoutes.post("/", MealController.createMeal);
mealRoutes.post("/calculate/nutrition", MealController.calculateNutrition);
mealRoutes.get("/daily", MealController.getMealsByDate);
mealRoutes.get("/analytics/daily-summary", MealController.getDailySummary);
mealRoutes.get("/analytics/weekly", MealController.getWeeklyAnalytics);
mealRoutes.get("/range", MealController.getMealsByDateRange);
mealRoutes.put("/:id", MealController.updateMeal);
mealRoutes.delete("/:id", MealController.deleteMeal);

module.exports = mealRoutes;
