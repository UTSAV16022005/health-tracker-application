const Activity = require("../models/Activity");

const ActivityController = {
    // Create activity record
    async createActivity(req, res) {
        try {
            const activity = await Activity.create(req.userId, req.body);
            res.status(201).json({ message: "Activity recorded successfully", activity });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Get daily activity
    async getDailyActivity(req, res) {
        try {
            const { date } = req.query;
            const activity = await Activity.getDailyActivity(req.userId, date || new Date());
            res.json(activity || { message: "No activity recorded for this date" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get activity for date range
    async getActivityByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: "Start date and end date required" });
            }

            const records = await Activity.getActivityByDateRange(req.userId, startDate, endDate);
            res.json({ records, total: records.length });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update activity
    async updateActivity(req, res) {
        try {
            const activity = await Activity.update(req.params.id, req.body);

            if (!activity) {
                return res.status(404).json({ error: "Activity record not found" });
            }

            res.json({ message: "Activity updated successfully", activity });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete activity
    async deleteActivity(req, res) {
        try {
            await Activity.delete(req.params.id);
            res.json({ message: "Activity deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get weekly summary
    async getWeeklySummary(req, res) {
        try {
            const summary = await Activity.getWeeklySummary(req.userId);
            res.json(summary);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ActivityController;
