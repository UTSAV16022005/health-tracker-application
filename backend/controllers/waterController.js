const WaterIntake = require("../models/WaterIntake");

const WaterController = {
    // Add water intake
    async addWater(req, res) {
        try {
            const water = await WaterIntake.create(req.userId, req.body);
            res.status(201).json({ message: "Water intake recorded", water });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Get daily water intake
    async getDailyIntake(req, res) {
        try {
            const { date } = req.query;
            const data = await WaterIntake.getDailyIntake(req.userId, date || new Date());
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get water intake for date range
    async getIntakeByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: "Start date and end date required" });
            }

            const data = await WaterIntake.getIntakeByDateRange(req.userId, startDate, endDate);
            res.json({ entries: data, total: data.length });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete water entry
    async deleteEntry(req, res) {
        try {
            await WaterIntake.delete(req.params.id);
            res.json({ message: "Water entry deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get weekly analytics
    async getWeeklyAnalytics(req, res) {
        try {
            const analytics = await WaterIntake.getWeeklyAnalytics(req.userId);
            res.json(analytics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = WaterController;
