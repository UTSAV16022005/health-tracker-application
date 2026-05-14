const { getDb } = require("../connect");
const { ObjectId } = require("mongodb");

const Sleep = {
    // Record sleep
    async create(userId, sleepData) {
        const db = getDb();
        const collection = db.collection("sleep");

        const sleep = {
            userId: new ObjectId(userId),
            startTime: new Date(sleepData.startTime),
            endTime: new Date(sleepData.endTime),
            duration: this.calculateDuration(sleepData.startTime, sleepData.endTime),
            quality: sleepData.quality || "normal", // poor, normal, good, excellent
            notes: sleepData.notes || "",
            date: new Date(sleepData.startTime),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(sleep);
        sleep._id = result.insertedId;
        return sleep;
    },

    // Get sleep records for date
    async getSleepByDate(userId, date = new Date()) {
        const db = getDb();
        const collection = db.collection("sleep");

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

        return await collection.findOne({
            userId: new ObjectId(userId),
            date: { $gte: startOfDay, $lte: endOfDay }
        });
    },

    // Get sleep records for date range
    async getSleepByDateRange(userId, startDate, endDate) {
        const db = getDb();
        const collection = db.collection("sleep");

        const parseLocal = (str, isEnd = false) => {
            if (typeof str === 'string') {
                const [y, m, d] = str.split('-').map(Number);
                const dt = new Date(y, m - 1, d);
                if (isEnd) dt.setHours(23, 59, 59, 999);
                return dt;
            }
            return new Date(str);
        };

        return await collection.find({
            userId: new ObjectId(userId),
            date: { $gte: parseLocal(startDate), $lte: parseLocal(endDate, true) }
        }).sort({ date: -1 }).toArray();
    },


    // Update sleep record
    async update(sleepId, updateData) {
        const db = getDb();
        const collection = db.collection("sleep");

        const updates = {
            startTime: updateData.startTime,
            endTime: updateData.endTime,
            quality: updateData.quality,
            notes: updateData.notes,
            updatedAt: new Date()
        };

        if (updateData.startTime && updateData.endTime) {
            updates.duration = this.calculateDuration(updateData.startTime, updateData.endTime);
            updates.date = new Date(updateData.startTime);
        }

        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(sleepId) },
            { $set: updates },
            { returnDocument: "after" }
        );

        return result.value;
    },

    // Delete sleep record
    async delete(sleepId) {
        const db = getDb();
        const collection = db.collection("sleep");
        await collection.deleteOne({ _id: new ObjectId(sleepId) });
        return { message: "Sleep record deleted successfully" };
    },

    // Get weekly sleep analytics
    async getWeeklyAnalytics(userId) {
        const db = getDb();
        const collection = db.collection("sleep");

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const sleepRecords = await collection.find({
            userId: new ObjectId(userId),
            date: { $gte: sevenDaysAgo }
        }).toArray();

        let totalDuration = 0;
        let avgDuration = 0;
        let qualityCount = { poor: 0, normal: 0, good: 0, excellent: 0 };

        sleepRecords.forEach(record => {
            totalDuration += record.duration || 0;
            qualityCount[record.quality]++;
        });

        avgDuration = sleepRecords.length > 0 ? totalDuration / sleepRecords.length : 0;

        return {
            avgDailyDuration: Math.round(avgDuration * 100) / 100,
            totalRecords: sleepRecords.length,
            qualityDistribution: qualityCount,
            bestQualityDay: Math.max(...Object.values(qualityCount))
        };
    },

    // Calculate duration in hours
    calculateDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        let durationMs = end - start;
        if (durationMs < 0) {
            // Assume the sleep crossed midnight and the user entered the same date for both
            durationMs += 24 * 60 * 60 * 1000;
        }
        const hours = durationMs / (1000 * 60 * 60);
        return Math.round(hours * 100) / 100;
    }
};

module.exports = Sleep;
