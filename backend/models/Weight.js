const { getDb } = require("../connect");
const { ObjectId } = require("mongodb");

const Weight = {
    // Add weight record
    async create(userId, weightData) {
        const db = getDb();
        const collection = db.collection("weight");

        const weight = {
            userId: new ObjectId(userId),
            weight: weightData.weight, // in kg
            unit: weightData.unit || "kg",
            bmi: weightData.bmi || null,
            notes: weightData.notes || "",
            date: weightData.date || new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(weight);
        weight._id = result.insertedId;
        return weight;
    },

    // Get weight records for date range
    async getWeightByDateRange(userId, startDate, endDate) {
        const db = getDb();
        const collection = db.collection("weight");

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

    // Get latest weight
    async getLatestWeight(userId) {
        const db = getDb();
        const collection = db.collection("weight");

        return await collection.findOne(
            { userId: new ObjectId(userId) },
            { sort: { date: -1 } }
        );
    },

    // Update weight record
    async update(weightId, updateData) {
        const db = getDb();
        const collection = db.collection("weight");

        const updates = {
            weight: updateData.weight,
            unit: updateData.unit,
            bmi: updateData.bmi,
            notes: updateData.notes,
            date: updateData.date,
            updatedAt: new Date()
        };

        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(weightId) },
            { $set: updates },
            { returnDocument: "after" }
        );

        return result.value;
    },

    // Delete weight record
    async delete(weightId) {
        const db = getDb();
        const collection = db.collection("weight");
        await collection.deleteOne({ _id: new ObjectId(weightId) });
        return { message: "Weight record deleted successfully" };
    },

    // Calculate BMI
    calculateBMI(weight, height) {
        // weight in kg, height in cm
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        return Math.round(bmi * 100) / 100;
    },

    // Get weight progress
    async getProgress(userId) {
        const db = getDb();
        const collection = db.collection("weight");

        const weights = await collection.find({
            userId: new ObjectId(userId)
        }).sort({ date: 1 }).toArray();

        if (weights.length === 0) {
            return { message: "No weight records found" };
        }

        const firstWeight = weights[0].weight;
        const lastWeight = weights[weights.length - 1].weight;
        const progress = lastWeight - firstWeight;

        return {
            initialWeight: firstWeight,
            currentWeight: lastWeight,
            weightChange: progress,
            totalRecords: weights.length,
            progressTrend: progress < 0 ? "losing" : progress > 0 ? "gaining" : "stable"
        };
    }
};

module.exports = Weight;
