const { getDb } = require("../connect");
const { ObjectId } = require("mongodb");

const Workout = {
    // Create a new workout
    async create(userId, workoutData) {
        const db = getDb();
        const collection = db.collection("workouts");

        const workout = {
            userId: new ObjectId(userId),
            type: workoutData.type, // cardio, strength, yoga, running
            duration: workoutData.duration, // in minutes
            caloriesBurned: workoutData.caloriesBurned || this.calculateCalories(workoutData.type, workoutData.duration),
            intensity: workoutData.intensity || "moderate", // low, moderate, high
            notes: workoutData.notes || "",
            date: workoutData.date || new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(workout);
        workout._id = result.insertedId;
        return workout;
    },

    // Get workouts for a user
    async getByUserId(userId, startDate = null, endDate = null) {
        const db = getDb();
        const collection = db.collection("workouts");

        let query = { userId: new ObjectId(userId) };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        return await collection.find(query).sort({ date: -1 }).toArray();
    },

    // Get workout by ID
    async getById(workoutId) {
        const db = getDb();
        const collection = db.collection("workouts");
        return await collection.findOne({ _id: new ObjectId(workoutId) });
    },

    // Update workout
    async update(workoutId, updateData) {
        const db = getDb();
        const collection = db.collection("workouts");

        const updates = {
            type: updateData.type,
            duration: updateData.duration,
            caloriesBurned: updateData.caloriesBurned,
            intensity: updateData.intensity,
            notes: updateData.notes,
            date: updateData.date,
            updatedAt: new Date()
        };

        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(workoutId) },
            { $set: updates },
            { returnDocument: "after" }
        );

        return result.value;
    },

    // Delete workout
    async delete(workoutId) {
        const db = getDb();
        const collection = db.collection("workouts");
        await collection.deleteOne({ _id: new ObjectId(workoutId) });
        return { message: "Workout deleted successfully" };
    },

    // Get weekly analytics
    async getWeeklyAnalytics(userId) {
        const db = getDb();
        const collection = db.collection("workouts");

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const workouts = await collection.find({
            userId: new ObjectId(userId),
            date: { $gte: sevenDaysAgo }
        }).toArray();

        let analytics = {
            totalWorkouts: workouts.length,
            totalDuration: 0,
            totalCalories: 0,
            byType: {}
        };

        workouts.forEach(w => {
            analytics.totalDuration += w.duration || 0;
            analytics.totalCalories += w.caloriesBurned || 0;

            if (!analytics.byType[w.type]) {
                analytics.byType[w.type] = { count: 0, calories: 0, duration: 0 };
            }
            analytics.byType[w.type].count++;
            analytics.byType[w.type].calories += w.caloriesBurned || 0;
            analytics.byType[w.type].duration += w.duration || 0;
        });

        return analytics;
    },

    // Calculate calories based on workout type and duration
    calculateCalories(type, duration) {
        const calorieRates = {
            cardio: 10,
            strength: 8,
            yoga: 4,
            running: 12
        };

        const rate = calorieRates[type] || 8;
        return Math.round(rate * duration);
    }
};

module.exports = Workout;
