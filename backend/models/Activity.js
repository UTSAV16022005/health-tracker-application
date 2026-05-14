const { getDb } = require("../connect");
const { ObjectId } = require("mongodb");

const Activity = {
    // Create activity record
    async create(userId, activityData) {
        const db = getDb();
        const collection = db.collection("activity");

        const activity = {
            userId: new ObjectId(userId),
            date: activityData.date || new Date(),
            steps: activityData.steps || 0,
            distance: activityData.distance || 0, // in km
            activeMinutes: activityData.activeMinutes || 0,
            caloriesBurned: activityData.caloriesBurned || 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(activity);
        activity._id = result.insertedId;
        return activity;
    },

    // Get daily activity
    async getDailyActivity(userId, date = new Date()) {
        const db = getDb();
        const collection = db.collection("activity");

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return await collection.findOne({
            userId: new ObjectId(userId),
            date: { $gte: startOfDay, $lte: endOfDay }
        });
    },

    // Get activity for date range
    async getActivityByDateRange(userId, startDate, endDate) {
        const db = getDb();
        const collection = db.collection("activity");

        return await collection.find({
            userId: new ObjectId(userId),
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).sort({ date: -1 }).toArray();
    },

    // Update activity
    async update(activityId, updateData) {
        const db = getDb();
        const collection = db.collection("activity");

        const updates = {
            steps: updateData.steps,
            distance: updateData.distance,
            activeMinutes: updateData.activeMinutes,
            caloriesBurned: updateData.caloriesBurned,
            updatedAt: new Date()
        };

        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(activityId) },
            { $set: updates },
            { returnDocument: "after" }
        );

        return result.value;
    },

    // Delete activity
    async delete(activityId) {
        const db = getDb();
        const collection = db.collection("activity");
        await collection.deleteOne({ _id: new ObjectId(activityId) });
        return { message: "Activity deleted successfully" };
    },

    // Get weekly activity summary
    async getWeeklySummary(userId) {
        const db = getDb();
        const collection = db.collection("activity");

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const activities = await collection.find({
            userId: new ObjectId(userId),
            date: { $gte: sevenDaysAgo }
        }).toArray();

        const summary = {
            totalSteps: 0,
            totalDistance: 0,
            totalActiveMinutes: 0,
            totalCalories: 0,
            avgDailySteps: 0,
            daysActive: activities.length
        };

        activities.forEach(activity => {
            summary.totalSteps += activity.steps || 0;
            summary.totalDistance += activity.distance || 0;
            summary.totalActiveMinutes += activity.activeMinutes || 0;
            summary.totalCalories += activity.caloriesBurned || 0;
        });

        if (activities.length > 0) {
            summary.avgDailySteps = Math.round(summary.totalSteps / 7);
        }

        return summary;
    }
};

module.exports = Activity;
