const Weight = require("../models/Weight");
const User = require("../models/User");

const WeightController = {
    // Add weight record
    async addWeight(req, res) {
        try {
            const user = await User.findById(req.userId);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Calculate BMI if height is available
            if (user.height && req.body.weight) {
                req.body.bmi = Weight.calculateBMI(req.body.weight, user.height);
            }

            const weight = await Weight.create(req.userId, req.body);
            res.status(201).json({ message: "Weight recorded successfully", weight });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Get weight records for date range
    async getWeightByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: "Start date and end date required" });
            }

            const records = await Weight.getWeightByDateRange(req.userId, startDate, endDate);
            res.json({ records, total: records.length });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get latest weight
    async getLatestWeight(req, res) {
        try {
            const weight = await Weight.getLatestWeight(req.userId);
            res.json(weight || { message: "No weight records found" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update weight record
    async updateWeight(req, res) {
        try {
            const weight = await Weight.update(req.params.id, req.body);

            if (!weight) {
                return res.status(404).json({ error: "Weight record not found" });
            }

            res.json({ message: "Weight record updated successfully", weight });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete weight record
    async deleteWeight(req, res) {
        try {
            await Weight.delete(req.params.id);
            res.json({ message: "Weight record deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get weight progress
    async getProgress(req, res) {
        try {
            const progress = await Weight.getProgress(req.userId);
            res.json(progress);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Calculate BMI
    calculateBMI(req, res) {
        try {
            const { weight, height } = req.body;

            if (!weight || !height) {
                return res.status(400).json({ error: "Weight and height required" });
            }

            const bmi = Weight.calculateBMI(weight, height);
            let category = "";

            if (bmi < 18.5) category = "Underweight";
            else if (bmi >= 18.5 && bmi < 25) category = "Normal weight";
            else if (bmi >= 25 && bmi < 30) category = "Overweight";
            else category = "Obese";

            res.json({ bmi, category });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = WeightController;
