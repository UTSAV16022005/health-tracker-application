const Sleep = require("../models/Sleep");

const SleepController = {
    // Record sleep
    async recordSleep(req, res) {
        try {
            const sleep = await Sleep.create(req.userId, req.body);
            res.status(201).json({ message: "Sleep recorded successfully", sleep });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Get sleep by date
    async getSleepByDate(req, res) {
        try {
            const { date } = req.query;
            const sleep = await Sleep.getSleepByDate(req.userId, date || new Date());
            res.json(sleep || { message: "No sleep record for this date" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get sleep for date range
    async getSleepByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: "Start date and end date required" });
            }

            const records = await Sleep.getSleepByDateRange(req.userId, startDate, endDate);
            res.json({ records, total: records.length });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update sleep record
    async updateSleep(req, res) {
        try {
            const sleep = await Sleep.update(req.params.id, req.body);

            if (!sleep) {
                return res.status(404).json({ error: "Sleep record not found" });
            }

            res.json({ message: "Sleep record updated successfully", sleep });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete sleep record
    async deleteSleep(req, res) {
        try {
            await Sleep.delete(req.params.id);
            res.json({ message: "Sleep record deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get weekly analytics
    async getWeeklyAnalytics(req, res) {
        try {
            const analytics = await Sleep.getWeeklyAnalytics(req.userId);
            res.json(analytics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = SleepController;
