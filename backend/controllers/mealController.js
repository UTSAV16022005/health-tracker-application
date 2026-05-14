const Meal = require("../models/Meal");

const MealController = {
    // Create meal
    async createMeal(req, res) {
        try {
            const meal = await Meal.create(req.userId, req.body);
            res.status(201).json({ message: "Meal added successfully", meal });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Get meals by date
    async getMealsByDate(req, res) {
        try {
            const { date } = req.query;
            const meals = await Meal.getMealsByDate(req.userId, date || new Date());
            res.json({ meals });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get meals for date range
    async getMealsByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: "Start date and end date required" });
            }

            const meals = await Meal.getMealsByDateRange(req.userId, startDate, endDate);
            res.json({ meals, total: meals.length });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update meal
    async updateMeal(req, res) {
        try {
            const meal = await Meal.update(req.params.id, req.body);

            if (!meal) {
                return res.status(404).json({ error: "Meal not found" });
            }

            res.json({ message: "Meal updated successfully", meal });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete meal
    async deleteMeal(req, res) {
        try {
            await Meal.delete(req.params.id);
            res.json({ message: "Meal deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get daily nutrition summary
    async getDailySummary(req, res) {
        try {
            const { date } = req.query;
            const summary = await Meal.getDailySummary(req.userId, date || new Date());
            res.json(summary);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get weekly nutrition analytics
    async getWeeklyAnalytics(req, res) {
        try {
            const analytics = await Meal.getWeeklyAnalytics(req.userId);
            res.json(analytics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // AI Nutrition Calculator - Calculate nutrition facts based on meal name and portion
    async calculateNutrition(req, res) {
        try {
            const { mealName, portions, mealType } = req.body;

            if (!mealName || portions === undefined) {
                return res.status(400).json({ error: "Meal name and portions are required" });
            }

            // Nutrition database (per 100g unless noted)
            const nutritionDatabase = {
                // Proteins
                'chicken breast': { calories: 165, protein: 31, carbs: 0,    fats: 3.6, portionSize: 100, note: 'Cooked, skinless chicken breast' },
                'chicken':        { calories: 165, protein: 31, carbs: 0,    fats: 3.6, portionSize: 100, note: 'Based on cooked chicken (skinless)' },
                'grilled chicken':{ calories: 165, protein: 31, carbs: 0,    fats: 3.6, portionSize: 100, note: 'Grilled skinless chicken' },
                'beef':           { calories: 250, protein: 26, carbs: 0,    fats: 15,  portionSize: 100, note: 'Lean ground beef' },
                'steak':          { calories: 271, protein: 27, carbs: 0,    fats: 17,  portionSize: 100, note: 'Sirloin steak, cooked' },
                'salmon':         { calories: 208, protein: 20, carbs: 0,    fats: 13,  portionSize: 100, note: 'Atlantic salmon, cooked' },
                'tuna':           { calories: 132, protein: 29, carbs: 0,    fats: 1.3, portionSize: 100 },
                'fish':           { calories: 96,  protein: 20, carbs: 0,    fats: 1,   portionSize: 100 },
                'shrimp':         { calories: 99,  protein: 24, carbs: 0,    fats: 0.3, portionSize: 100 },
                'pork':           { calories: 242, protein: 27, carbs: 0,    fats: 14,  portionSize: 100 },
                'lamb':           { calories: 258, protein: 25, carbs: 0,    fats: 17,  portionSize: 100 },
                'turkey':         { calories: 135, protein: 30, carbs: 0,    fats: 1,   portionSize: 100 },
                'tofu':           { calories: 76,  protein: 8,  carbs: 1.9,  fats: 4.8, portionSize: 100 },
                'eggs':           { calories: 155, protein: 13, carbs: 1.1,  fats: 11,  portionSize: 100 },
                'egg':            { calories: 155, protein: 13, carbs: 1.1,  fats: 11,  portionSize: 100 },

                // Grains & carbs
                'white rice':     { calories: 130, protein: 2.7, carbs: 28, fats: 0.3, portionSize: 100 },
                'brown rice':     { calories: 112, protein: 2.6, carbs: 24, fats: 0.9, portionSize: 100 },
                'rice':           { calories: 130, protein: 2.7, carbs: 28, fats: 0.3, portionSize: 100 },
                'pasta':          { calories: 131, protein: 5,   carbs: 25, fats: 1.1, portionSize: 100 },
                'bread':          { calories: 265, protein: 9,   carbs: 49, fats: 3.3, portionSize: 100 },
                'oatmeal':        { calories: 150, protein: 5,   carbs: 27, fats: 3,   portionSize: 100 },
                'oats':           { calories: 389, protein: 17,  carbs: 66, fats: 7,   portionSize: 100 },
                'potato':         { calories: 77,  protein: 2,   carbs: 17, fats: 0.1, portionSize: 100 },
                'sweet potato':   { calories: 86,  protein: 1.6, carbs: 20, fats: 0.1, portionSize: 100 },
                'toast':          { calories: 79,  protein: 2.7, carbs: 14, fats: 1,   portionSize: 28  },
                'pancakes':       { calories: 227, protein: 5,   carbs: 42, fats: 5,   portionSize: 100 },
                'waffle':         { calories: 291, protein: 8,   carbs: 41, fats: 10,  portionSize: 100 },
                'granola':        { calories: 471, protein: 12,  carbs: 64, fats: 18,  portionSize: 100 },
                'chapati':        { calories: 297, protein: 9,   carbs: 52, fats: 6,   portionSize: 100 },
                'roti':           { calories: 297, protein: 9,   carbs: 52, fats: 6,   portionSize: 100 },
                'naan':           { calories: 310, protein: 9,   carbs: 52, fats: 8,   portionSize: 100 },
                'idli':           { calories: 39,  protein: 2,   carbs: 8,  fats: 0.2, portionSize: 100 },
                'dosa':           { calories: 168, protein: 3.8, carbs: 27, fats: 5,   portionSize: 100 },

                // Dairy
                'milk':           { calories: 42,  protein: 3.4, carbs: 5,   fats: 1,  portionSize: 100 },
                'cheese':         { calories: 402, protein: 25,  carbs: 1.3, fats: 33, portionSize: 100 },
                'yogurt':         { calories: 59,  protein: 10,  carbs: 3.6, fats: 0.4,portionSize: 100 },
                'butter':         { calories: 717, protein: 0.9, carbs: 0.1, fats: 81, portionSize: 100 },
                'paneer':         { calories: 265, protein: 18,  carbs: 1.2, fats: 21, portionSize: 100 },

                // Vegetables
                'salad':          { calories: 15,  protein: 1.2, carbs: 2.9, fats: 0.2, portionSize: 100 },
                'broccoli':       { calories: 34,  protein: 2.8, carbs: 7,   fats: 0.4, portionSize: 100 },
                'carrot':         { calories: 41,  protein: 0.9, carbs: 10,  fats: 0.2, portionSize: 100 },
                'spinach':        { calories: 23,  protein: 2.9, carbs: 3.6, fats: 0.4, portionSize: 100 },
                'tomato':         { calories: 18,  protein: 0.9, carbs: 3.9, fats: 0.2, portionSize: 100 },

                // Fruits
                'banana':         { calories: 89,  protein: 1.1, carbs: 23, fats: 0.3, portionSize: 100 },
                'apple':          { calories: 52,  protein: 0.3, carbs: 14, fats: 0.2, portionSize: 100 },
                'orange':         { calories: 47,  protein: 0.9, carbs: 12, fats: 0.3, portionSize: 100 },
                'mango':          { calories: 60,  protein: 0.8, carbs: 15, fats: 0.4, portionSize: 100 },

                // Legumes
                'beans':          { calories: 127, protein: 8.7, carbs: 23, fats: 0.5, portionSize: 100 },
                'lentils':        { calories: 116, protein: 9,   carbs: 20, fats: 0.4, portionSize: 100 },
                'dal':            { calories: 116, protein: 9,   carbs: 20, fats: 0.4, portionSize: 100 },
                'chickpeas':      { calories: 164, protein: 9,   carbs: 27, fats: 2.6, portionSize: 100 },

                // Fast food
                'pizza':          { calories: 266, protein: 12, carbs: 36, fats: 10, portionSize: 100 },
                'burger':         { calories: 354, protein: 17, carbs: 30, fats: 15, portionSize: 100 },

                // Snacks & nuts
                'almonds':        { calories: 579, protein: 21, carbs: 22, fats: 50, portionSize: 100 },
                'peanuts':        { calories: 567, protein: 26, carbs: 16, fats: 49, portionSize: 100 },
                'chocolate':      { calories: 546, protein: 4.9,carbs: 57, fats: 31, portionSize: 100 },
                'chips':          { calories: 536, protein: 5.7, carbs: 53,fats: 35, portionSize: 100 },

                // Beverages
                'juice':          { calories: 42, protein: 0.5, carbs: 10, fats: 0.1, portionSize: 100 },
                'milk':           { calories: 42, protein: 3.4, carbs: 5,  fats: 1,   portionSize: 100 },
                'smoothie':       { calories: 120, protein: 5,  carbs: 22, fats: 2,   portionSize: 250 },
                'coffee':         { calories: 2,  protein: 0.3, carbs: 0,  fats: 0.1, portionSize: 100 },
                'tea':            { calories: 1,  protein: 0,   carbs: 0,  fats: 0,   portionSize: 100 },
            };

            // Find matching meal — case-insensitive, word-level fuzzy match
            let nutrition = null;
            const lowerMealName = mealName.toLowerCase().trim();
            const inputWords = lowerMealName.split(/\s+/);

            // 1. Exact match
            if (nutritionDatabase[lowerMealName]) {
                nutrition = nutritionDatabase[lowerMealName];
            }

            // 2. Input contains a database key (e.g. "grilled chicken" contains "chicken")
            if (!nutrition) {
                for (const [key, value] of Object.entries(nutritionDatabase)) {
                    if (lowerMealName.includes(key)) {
                        nutrition = value;
                        break;
                    }
                }
            }

            // 3. Any single input word matches any database key word
            if (!nutrition) {
                for (const [key, value] of Object.entries(nutritionDatabase)) {
                    const keyWords = key.split(/\s+/);
                    const hasCommonWord = inputWords.some(w => w.length > 2 && keyWords.includes(w));
                    if (hasCommonWord) {
                        nutrition = value;
                        break;
                    }
                }
            }

            // If still not found, use a generic estimate
            const isEstimated = !nutrition;
            if (!nutrition) {
                nutrition = {
                    calories: 200, protein: 10, carbs: 25, fats: 7,
                    portionSize: 100,
                    note: 'Values estimated — specific data not found for this food.'
                };
            }

            // Calculate scaled to actual portion
            const portionMultiplier = portions / nutrition.portionSize;
            const result = {
                mealName,
                portions,
                calories: Math.round(nutrition.calories * portionMultiplier),
                protein:  Math.round(nutrition.protein  * portionMultiplier * 10) / 10,
                carbs:    Math.round(nutrition.carbs    * portionMultiplier * 10) / 10,
                fats:     Math.round(nutrition.fats     * portionMultiplier * 10) / 10,
                estimated: isEstimated,
                confidence: isEstimated ? 'low' : 'high',
                note: nutrition.note || null,
            };

            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = MealController;
