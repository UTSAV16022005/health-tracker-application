const { getDb } = require("../connect");
const { ObjectId } = require("mongodb");

const Meal = {
    // Add a meal
    async create(userId, mealData) {
        const db = getDb();
        const collection = db.collection("meals");

        const meal = {
            userId: new ObjectId(userId),
            // Accept both frontend field names (name/type/fats) and legacy (foodName/mealType/fat)
            name:     mealData.name     || mealData.foodName  || '',
            type:     mealData.type     || mealData.mealType  || 'breakfast',
            calories: mealData.calories || 0,
            protein:  mealData.protein  || 0,
            carbs:    mealData.carbs    || 0,
            fats:     mealData.fats     || mealData.fat       || 0,
            portions: mealData.portions || mealData.quantity  || 0,
            unit:     mealData.unit     || 'g',
            date:     mealData.date ? new Date(mealData.date) : new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(meal);
        meal._id = result.insertedId;
        return meal;
    },

    // Get meals for a user on a specific date
    async getMealsByDate(userId, date = new Date()) {
        const db = getDb();
        const collection = db.collection("meals");

        // Use local-time boundaries (server runs in local TZ, dates stored as local new Date())
        let baseDate;
        if (typeof date === 'string') {
            const [y, m, d] = date.split('-').map(Number);
            baseDate = new Date(y, m - 1, d);
        } else {
            baseDate = new Date(date);
        }
        const startOfDay = new Date(baseDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(baseDate);
        endOfDay.setHours(23, 59, 59, 999);

        return await collection.find({
            userId: new ObjectId(userId),
            date: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ date: -1 }).toArray();
    },

    // Get meals for date range
    async getMealsByDateRange(userId, startDate, endDate) {
        const db = getDb();
        const collection = db.collection("meals");

        const parseLocal = (str, endOfDay = false) => {
            if (typeof str === 'string') {
                const [y, m, d] = str.split('-').map(Number);
                const dt = new Date(y, m - 1, d);
                if (endOfDay) dt.setHours(23, 59, 59, 999);
                return dt;
            }
            return new Date(str);
        };

        return await collection.find({
            userId: new ObjectId(userId),
            date: { $gte: parseLocal(startDate), $lte: parseLocal(endDate, true) }
        }).sort({ date: -1 }).toArray();
    },

    // Update meal
    async update(mealId, updateData) {
        const db = getDb();
        const collection = db.collection("meals");

        const updates = {
            mealType: updateData.mealType,
            foodName: updateData.foodName,
            calories: updateData.calories,
            protein: updateData.protein,
            carbs: updateData.carbs,
            fat: updateData.fat,
            quantity: updateData.quantity,
            unit: updateData.unit,
            date: updateData.date,
            updatedAt: new Date()
        };

        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(mealId) },
            { $set: updates },
            { returnDocument: "after" }
        );

        return result.value;
    },

    // Delete meal
    async delete(mealId) {
        const db = getDb();
        const collection = db.collection("meals");
        await collection.deleteOne({ _id: new ObjectId(mealId) });
        return { message: "Meal deleted successfully" };
    },

    // Get daily nutrition summary
    async getDailySummary(userId, date = new Date()) {
        const meals = await this.getMealsByDate(userId, date);

        const summary = {
            totalCalories: 0,
            totalProtein:  0,
            totalCarbs:    0,
            totalFats:     0,   // frontend reads .totalFats
            meals: meals.length,
            byMealType: {}
        };

        meals.forEach(meal => {
            summary.totalCalories += meal.calories || 0;
            summary.totalProtein  += meal.protein  || 0;
            summary.totalCarbs    += meal.carbs    || 0;
            summary.totalFats     += meal.fats     || meal.fat || 0;

            const mealType = meal.type || meal.mealType || 'other';
            if (!summary.byMealType[mealType]) {
                summary.byMealType[mealType] = { calories: 0, protein: 0, carbs: 0, fats: 0 };
            }
            summary.byMealType[mealType].calories += meal.calories || 0;
            summary.byMealType[mealType].protein  += meal.protein  || 0;
            summary.byMealType[mealType].carbs    += meal.carbs    || 0;
            summary.byMealType[mealType].fats     += meal.fats     || meal.fat || 0;
        });

        return summary;
    },

    // Get weekly nutrition analytics
    async getWeeklyAnalytics(userId) {
        const db = getDb();
        const collection = db.collection("meals");

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const meals = await collection.find({
            userId: new ObjectId(userId),
            date: { $gte: sevenDaysAgo }
        }).toArray();

        const analytics = {
            avgDailyCalories: 0,
            avgDailyProtein: 0,
            avgDailyCarbs: 0,
            avgDailyFat: 0,
            totalMeals: meals.length
        };

        let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

        meals.forEach(m => {
            totalCalories += m.calories || 0;
            totalProtein += m.protein || 0;
            totalCarbs += m.carbs || 0;
            totalFat += m.fat || 0;
        });

        analytics.avgDailyCalories = Math.round(totalCalories / 7);
        analytics.avgDailyProtein = Math.round(totalProtein / 7);
        analytics.avgDailyCarbs = Math.round(totalCarbs / 7);
        analytics.avgDailyFat = Math.round(totalFat / 7);

        return analytics;
    }
};

module.exports = Meal;
