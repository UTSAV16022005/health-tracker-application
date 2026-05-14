const { getDb } = require("../connect");
const { ObjectId } = require("mongodb");

const WaterIntake = {
    // Add water intake
    async create(userId, waterData) {
        const db = getDb();
        const collection = db.collection("water_intake");

        const waterEntry = {
            userId: new ObjectId(userId),
            amount: waterData.amount, // in ml
            unit: waterData.unit || "ml",
            timestamp: waterData.timestamp ? new Date(waterData.timestamp) : new Date(),
            createdAt: new Date()
        };

        const result = await collection.insertOne(waterEntry);
        waterEntry._id = result.insertedId;
        return waterEntry;
    },

    // Get daily water intake
    async getDailyIntake(userId, date = new Date()) {
        const db = getDb();
        const collection = db.collection("water_intake");

        // Parse the date in local time so the day window is correct for any timezone
        let baseDate;
        if (typeof date === 'string') {
            // 'yyyy-MM-dd' — treat as local midnight
            const [y, m, d] = date.split('-').map(Number);
            baseDate = new Date(y, m - 1, d);
        } else {
            baseDate = new Date(date);
        }
        const startOfDay = new Date(baseDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(baseDate);
        endOfDay.setHours(23, 59, 59, 999);

        const entries = await collection.find({
            userId: new ObjectId(userId),
            timestamp: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ timestamp: 1 }).toArray();

        const totalAmount = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);

        return {
            date,
            totalAmount,
            entries,
            entries_count: entries.length
        };
    },

    // Get water intake for date range
    async getIntakeByDateRange(userId, startDate, endDate) {
        const db = getDb();
        const collection = db.collection("water_intake");

        return await collection.find({
            userId: new ObjectId(userId),
            timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).sort({ timestamp: -1 }).toArray();
    },

    // Delete water entry
    async delete(entryId) {
        const db = getDb();
        const collection = db.collection("water_intake");
        await collection.deleteOne({ _id: new ObjectId(entryId) });
        return { message: "Water entry deleted successfully" };
    },

    // Get weekly water intake analytics
    async getWeeklyAnalytics(userId) {
        const db = getDb();
        const collection = db.collection("water_intake");

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const entries = await collection.find({
            userId: new ObjectId(userId),
            timestamp: { $gte: sevenDaysAgo }
        }).toArray();

        let dailyData = {};
        entries.forEach(entry => {
            const day = new Date(entry.timestamp).toDateString();
            if (!dailyData[day]) dailyData[day] = 0;
            dailyData[day] += entry.amount || 0;
        });

        const avgDaily = Math.round(
            Object.values(dailyData).reduce((a, b) => a + b, 0) / 7
        );

        return {
            avgDailyIntake: avgDaily,
            dailyBreakdown: dailyData,
            totalEntries: entries.length
        };
    }
};

module.exports = WaterIntake;
